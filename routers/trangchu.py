import os

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine
from datetime import datetime, date
from decimal import Decimal

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Bản tiếng Việt của Kage — cùng thư mục với bản gốc nên các đường dẫn
# tương đối tới asset vẫn resolve đúng.
KAGE_SCENE_FILE = r"A:\threeui-kage\app\dist\landing-pages\kage-vi.html"


def serialize_row(row):
    d = dict(row._mapping)
    for k, v in d.items():
        if isinstance(v, (datetime, date)):
            d[k] = v.isoformat()
        elif isinstance(v, Decimal):
            d[k] = float(v)
    return d


<<<<<<< Updated upstream
@router.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    try:
        with engine.connect() as conn:
            tong_ban = conn.execute(text("SELECT COUNT(*) FROM banan")).scalar() or 0
            tong_monan = conn.execute(text("SELECT COUNT(*) FROM monan")).scalar() or 0
            tong_hoadon = conn.execute(text("SELECT COUNT(*) FROM hoadon")).scalar() or 0
            doanhthu = conn.execute(text("SELECT COALESCE(SUM(tongthanhtoan), SUM(tongtien), 0) FROM hoadon WHERE trangthai='DaThanhToan'")).scalar() or 0
            bans = conn.execute(text("""
                SELECT maban AS MaBan, tenban AS TenBan, 
                       CASE 
                           WHEN trangthai = 'DangSuDung' THEN 'Dang su dung'
                           WHEN trangthai = 'DaDat' THEN 'Da dat'
                           ELSE 'Trong'
                       END AS TrangThai 
                FROM banan
            """)).fetchall()
            recent_hds = conn.execute(text("""
                SELECT h.mahd AS MaHD, COALESCE(h.tongthanhtoan, h.tongtien, 0) AS TongTien, 
                       CASE WHEN h.trangthai = 'DaThanhToan' THEN 'Da thanh toan' ELSE 'Dang phuc vu' END AS TrangThai, 
                       b.tenban AS TenBan 
                FROM hoadon h LEFT JOIN banan b ON h.maban=b.maban 
                ORDER BY h.mahd DESC LIMIT 5
            """)).fetchall()
    except Exception as e:
        print("Lỗi dashboard:", e)
        tong_ban, tong_monan, tong_hoadon, doanhthu, bans, recent_hds = 0, 0, 0, 0, [], []
    return templates.TemplateResponse(request, "index.html", {
        "tong_ban": tong_ban,
        "tong_monan": tong_monan,
        "tong_hoadon": tong_hoadon,
        "doanhthu": doanhthu,
        "bans": bans,
        "recent_hds": recent_hds,
        "active_page": "dashboard",
    })
=======
def load_dashboard_data():
    with engine.connect() as conn:
        return {
            "tong_ban": conn.execute(text("SELECT COUNT(*) FROM ban")).scalar(),
            "tong_monan": conn.execute(text("SELECT COUNT(*) FROM monan")).scalar(),
            "tong_hoadon": conn.execute(text("SELECT COUNT(*) FROM hoadon")).scalar(),
            "doanhthu": conn.execute(text("SELECT COALESCE(SUM(TongTien),0) FROM hoadon WHERE TrangThai='Da thanh toan'")).scalar(),
            "bans": conn.execute(text("SELECT * FROM ban ORDER BY MaBan")).fetchall(),
            "monan_items": conn.execute(text(
                "SELECT m.*, d.ten_danhmuc "
                "FROM monan m LEFT JOIN danhmuc d ON m.MaDM = d.id "
                "ORDER BY m.MaMon"
            )).fetchall(),
            "hoadon_items": conn.execute(text(
                "SELECT h.*, b.TenBan, n.HoTen AS TenNV "
                "FROM hoadon h "
                "LEFT JOIN ban b ON h.MaBan = b.MaBan "
                "LEFT JOIN nhanvien n ON h.MaNV = n.MaNV "
                "ORDER BY h.MaHD DESC"
            )).fetchall(),
            "nhanvien_items": conn.execute(text("SELECT * FROM nhanvien ORDER BY MaNV")).fetchall(),
            "recent_hds": conn.execute(text(
                "SELECT h.MaHD, h.TongTien, h.TrangThai, b.TenBan "
                "FROM hoadon h LEFT JOIN ban b ON h.MaBan=b.MaBan "
                "ORDER BY h.MaHD DESC LIMIT 5"
            )).fetchall(),
        }


@router.get("/", response_class=HTMLResponse)
@router.get("/kage/scene", response_class=HTMLResponse)
def kage_scene(request: Request):
    """Trang duy nhất của ứng dụng: bản Kage tiếng Việt, có nối sẵn
    phần quản lý nhà hàng.

    Không dùng iframe nữa — trước đây cảnh Kage nằm trong khung còn
    4 mục nghiệp vụ nằm ở trang ngoài, thành hai trang. Nay tài liệu
    Kage đọc lên rồi chèn thẳng mọi phần vào, nên chỉ còn một trang:
    cuộn là liền mạch, bấm neo là tới đúng khu vực.

    File kage-vi.html trên đĩa không bị sửa; mọi thay đổi diễn ra lúc
    phục vụ. Bản gốc kage.html vẫn nguyên vẹn.
    """
    if not os.path.isfile(KAGE_SCENE_FILE):
        return RedirectResponse(url="/kage-missing", status_code=302)

    with open(KAGE_SCENE_FILE, "r", encoding="utf-8") as f:
        page = f.read()

    # Trang này phục vụ ở /, không phải /landing-pages/, nên đường dẫn
    # tương đối trong tài liệu phải đổi thành tuyệt đối.
    page = page.replace(
        "secret-pathways-assets/", "/landing-pages/secret-pathways-assets/"
    )

    d = load_dashboard_data()
    d.update({"nhanviens": d["nhanvien_items"], "monans": d["monan_items"]})
    tpl = templates.get_template
    nav = tpl("_kage_nav.html").render(**d)
    cards = tpl("_kage_overview.html").render(**d)
    ban = tpl("_kage_ban.html").render(**d)
    sections = tpl("_kage_sections.html").render(**d)

    if "</head>" in page:
        page = page.replace(
            "</head>",
            '<link rel="stylesheet" href="/static/css/kage-overview.css" />\n</head>',
            1,
        )

    # 1 · Thay ruột thanh điều hướng, giữ nguyên <header class="nav"
    #     id="nav"> để kịch bản Kage vẫn ghim/ẩn thanh khi cuộn.
    h0 = page.find('<header class="nav" id="nav">')
    h1 = page.find("</header>", h0)
    if h0 != -1 and h1 != -1:
        head_open_end = h0 + len('<header class="nav" id="nav">')
        page = page[:head_open_end] + "\n" + nav.strip() + "\n" + page[h1:]

    # 2 · Ba ô dữ liệu của chương "Vườn Tĩnh"
    marker = '<div class="cards" id="cards">'
    if marker in page:
        start = page.index(marker)
        end = page.index("</section>", start)
        seg = page[start:end]
        close = seg.rindex("</div>") + len("</div>")
        page = page[:start] + cards.strip() + page[start + close:]

    # 3 · Chương "Tay Nghề Thiêng" → phần quản lý bàn.
    #     Chương này không có <section> lồng nên </section> đầu là điểm đóng.
    sec_marker = '<section class="sec" id="lessons"'
    if sec_marker in page:
        s0 = page.index(sec_marker)
        s1 = page.index("</section>", s0) + len("</section>")
        page = page[:s0] + ban.strip() + page[s1:]

    # 4 · Món Ăn · Hóa Đơn · Nhân Viên — nối ngay sau chương Bàn,
    #     trước chương kết "Ánh Dư".
    fin = '<section class="sec fin" id="eternity"'
    if fin in page:
        f0 = page.index(fin)
        page = page[:f0] + sections.strip() + "\n\n" + page[f0:]

    # 5 · "Bốn nơi làm việc" nằm ngay dưới dãy 01 02 03 04 của hero.
    #     Chèn trước </section> của hero để hero vẫn đúng một màn hình.
    chapters = tpl("_kage_chapters.html").render(**d)
    hero_marker = '<section class="hero" id="hero"'
    if hero_marker in page:
        h_end = page.index("</section>", page.index(hero_marker))
        page = page[:h_end] + chapters.strip() + "\n" + page[h_end:]

    # 6 · Đánh số lại: giờ đã có chương 04/05/06 nên chương kết là 07.
    page = page.replace("Chương 04 — Ánh Dư", "Chương 07 — Ánh Dư")

    return HTMLResponse(page)
>>>>>>> Stashed changes


@router.get("/api/ban/{ma_ban}/detail")
def api_ban_detail(ma_ban: int):
    try:
        with engine.connect() as conn:
            ban = conn.execute(text("SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, sachogoi AS SucChua, trangthai AS TrangThai FROM banan WHERE maban=:id"), {"id": ma_ban}).fetchone()
            if not ban:
                return JSONResponse({"error": "Khong tim thay ban"}, status_code=404)

            ban_info = serialize_row(ban)

            datban_rows = conn.execute(text("""
                SELECT db.madatban AS MaDatBan, db.maban AS MaBan, db.makh AS MaKH, db.ngaydat AS NgayDat, db.giodat AS GioDat, db.songuoi AS SoNguoi, db.ghiChu AS GhiChu, db.trangthai AS TrangThai,
                       kh.hoten AS TenKH, kh.sodienthoai AS SDT, kh.email AS Email
                FROM datban db
                LEFT JOIN khachhang kh ON db.makh = kh.makh
                WHERE db.maban = :id
                ORDER BY db.ngaydat DESC
            """), {"id": ma_ban}).fetchall()
            datban_list = [serialize_row(r) for r in datban_rows]

            hoadon_rows = conn.execute(text("""
                SELECT h.mahd AS MaHD, h.maban AS MaBan, h.manv AS MaNV, h.makh AS MaKH, h.ngaytao AS NgayLap, 
                       h.tongtien AS TongTien, h.giamgia AS GiamGia, COALESCE(h.tongthanhtoan, h.tongtien, 0) AS ThanhTien,
                       h.trangthai AS TrangThai, nv.hoten AS TenNV
                FROM hoadon h
                LEFT JOIN nhanvien nv ON h.manv = nv.manv
                WHERE h.maban = :id
                ORDER BY h.mahd DESC
            """), {"id": ma_ban}).fetchall()
            hoadon_list = []
            for hd in hoadon_rows:
                hd_dict = serialize_row(hd)
                cthd = conn.execute(text("""
                    SELECT ct.mahd AS MaHD, ct.mamon AS MaMon, ct.soluong AS SoLuong, ct.dongia AS DonGia, ct.thanhtien AS ThanhTien, m.tenmon AS TenMon
                    FROM ct_hoadon ct
                    LEFT JOIN monan m ON ct.mamon = m.mamon
                    WHERE ct.mahd = :mahd
                """), {"mahd": hd.MaHD}).fetchall()
                hd_dict["chitiet"] = [serialize_row(c) for c in cthd]
                hoadon_list.append(hd_dict)

        return JSONResponse({
            "ban": ban_info,
            "datban": datban_list,
            "hoadon": hoadon_list,
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
