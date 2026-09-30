from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine
from datetime import datetime, date
from decimal import Decimal

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def serialize_row(row):
    d = dict(row._mapping)
    for k, v in d.items():
        if isinstance(v, (datetime, date)):
            d[k] = v.isoformat()
        elif isinstance(v, Decimal):
            d[k] = float(v)
    return d


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
