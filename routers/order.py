import json
import logging
from typing import Optional
from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine

logger = logging.getLogger(__name__)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/order", response_class=HTMLResponse)
def order_page(request: Request, maban: Optional[int] = None):
    try:
        cur_user = request.session.get("user") if "session" in request.scope else None
        
        with engine.connect() as conn:
            # 1. Danh sách bàn
            bans = conn.execute(text("""
                SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, sachogoi AS SucChua, trangthai AS TrangThai
                FROM banan ORDER BY maban
            """)).mappings().all()

            # 2. Danh mục món ăn
            danhmucs = conn.execute(text("""
                SELECT madm AS MaDM, tendm AS TenDM FROM danhmuc ORDER BY madm
            """)).mappings().all()

            # 3. Danh sách món ăn đang phục vụ
            monans = conn.execute(text("""
                SELECT m.mamon AS MaMon, m.tenmon AS TenMon, m.gia AS Gia, m.mota AS MoTa,
                       m.hinhanh AS HinhAnh, m.madm AS MaDM, d.tendm AS TenDM
                FROM monan m
                LEFT JOIN danhmuc d ON m.madm = d.madm
                WHERE m.trangthai = 1
                ORDER BY m.madm, m.tenmon
            """)).mappings().all()

            # 4. Danh sách nhân viên
            nhanviens = conn.execute(text("""
                SELECT manv AS MaNV, hoten AS HoTen FROM nhanvien ORDER BY hoten
            """)).mappings().all()

            # 5. Nếu có bàn được chọn, kiểm tra xem bàn đã có hóa đơn đang mở chưa
            selected_ban = None
            active_hoadon = None
            existing_items = []
            
            if maban:
                selected_ban = conn.execute(
                    text("SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, trangthai AS TrangThai FROM banan WHERE maban = :id"),
                    {"id": maban}
                ).mappings().first()

                if selected_ban:
                    active_hd_row = conn.execute(
                        text("SELECT mahd, tongtien, giamgia, tongthanhtoan FROM hoadon WHERE maban = :maban AND trangthai = 'Cho' ORDER BY mahd DESC LIMIT 1"),
                        {"maban": maban}
                    ).mappings().first()

                    if active_hd_row:
                        active_hoadon = dict(active_hd_row)
                        items_rows = conn.execute(text("""
                            SELECT ct.mamon AS MaMon, m.tenmon AS TenMon, ct.soluong AS SoLuong,
                                   ct.dongia AS DonGia, (ct.soluong * ct.dongia) AS ThanhTien
                            FROM ct_hoadon ct
                            JOIN monan m ON ct.mamon = m.mamon
                            WHERE ct.mahd = :mahd
                        """), {"mahd": active_hoadon["mahd"]}).mappings().all()
                        existing_items = [dict(r) for r in items_rows]

        return templates.TemplateResponse(
            request,
            "order.html",
            {
                "bans": bans,
                "danhmucs": danhmucs,
                "monans": monans,
                "nhanviens": nhanviens,
                "selected_maban": maban,
                "selected_ban": selected_ban,
                "active_hoadon": active_hoadon,
                "existing_items": existing_items,
                "cur_user": cur_user,
                "active_page": "order"
            }
        )
    except Exception as e:
        logger.error(f"Lỗi tải trang order: {e}")
        return HTMLResponse(f"<h3>Lỗi hệ thống: {e}</h3>", status_code=500)


@router.get("/api/order/table/{maban}")
def api_table_order(maban: int):
    """Lấy thông tin order hiện tại của bàn (dùng cho AJAX chuyển bàn nhanh)."""
    try:
        with engine.connect() as conn:
            ban = conn.execute(
                text("SELECT maban AS MaBan, tenban AS TenBan, trangthai AS TrangThai FROM banan WHERE maban = :id"),
                {"id": maban}
            ).mappings().first()

            if not ban:
                return JSONResponse({"error": "Bàn không tồn tại"}, status_code=404)

            active_hd = conn.execute(
                text("SELECT mahd, tongtien, giamgia FROM hoadon WHERE maban = :maban AND trangthai = 'Cho' ORDER BY mahd DESC LIMIT 1"),
                {"maban": maban}
            ).mappings().first()

            items = []
            if active_hd:
                rows = conn.execute(text("""
                    SELECT ct.mamon AS MaMon, m.tenmon AS TenMon, ct.soluong AS SoLuong,
                           ct.dongia AS DonGia, (ct.soluong * ct.dongia) AS ThanhTien
                    FROM ct_hoadon ct
                    JOIN monan m ON ct.mamon = m.mamon
                    WHERE ct.mahd = :mahd
                """), {"mahd": active_hd["mahd"]}).mappings().all()
                items = [dict(r) for r in rows]

            return JSONResponse({
                "ban": dict(ban),
                "active_hoadon": dict(active_hd) if active_hd else None,
                "items": items
            })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.post("/order/submit")
async def submit_order(request: Request):
    """Nhận danh sách món được chọn từ nhân viên/khách và lưu vào CSDL."""
    try:
        # Hỗ trợ cả JSON body lẫn Form data
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
            maban = int(data.get("maban"))
            manv = data.get("manv")
            items = data.get("items", [])  # list of {mamon, soluong, dongia}
        else:
            form = await request.form()
            maban = int(form.get("maban"))
            manv = form.get("manv")
            items_raw = form.get("items_json", "[]")
            items = json.loads(items_raw)

        if not maban:
            return JSONResponse({"success": False, "message": "Vui lòng chọn bàn!"}, status_code=400)

        if not items:
            return JSONResponse({"success": False, "message": "Chưa chọn món nào!"}, status_code=400)

        # Lấy nhân viên mặc định nếu không chọn
        cur_user = request.session.get("user") if "session" in request.scope else None
        if not manv:
            manv = cur_user.get("manv") if cur_user else None

        with engine.begin() as conn:
            # 1. Tìm hoặc tạo hóa đơn đang mở ('Cho') cho bàn
            active_hd = conn.execute(
                text("SELECT mahd FROM hoadon WHERE maban = :maban AND trangthai = 'Cho' ORDER BY mahd DESC LIMIT 1"),
                {"maban": maban}
            ).mappings().first()

            if active_hd:
                mahd = active_hd["mahd"]
            else:
                # Nếu chưa có nhân viên nào, gán nhân viên đầu tiên
                if not manv:
                    manv = conn.execute(text("SELECT manv FROM nhanvien LIMIT 1")).scalar() or 1

                res = conn.execute(
                    text("INSERT INTO hoadon (maban, manv, tongtien, trangthai) VALUES (:maban, :manv, 0, 'Cho')"),
                    {"maban": maban, "manv": manv}
                )
                mahd = res.lastrowid
                if not mahd:
                    mahd = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()

                # Cập nhật trạng thái bàn sang 'DangSuDung'
                conn.execute(text("UPDATE banan SET trangthai = 'DangSuDung' WHERE maban = :maban"), {"maban": maban})

            # 2. Thêm hoặc cập nhật số lượng từng món trong chi tiết hóa đơn
            for it in items:
                mamon = int(it["mamon"])
                soluong = int(it.get("soluong", 1))
                if soluong <= 0:
                    continue

                # Lấy đơn giá chuẩn từ bảng monan
                dongia = conn.execute(text("SELECT gia FROM monan WHERE mamon = :mamon"), {"mamon": mamon}).scalar()
                if dongia is None:
                    dongia = float(it.get("dongia", 0))
                else:
                    dongia = float(dongia)

                # Kiểm tra món đã có trong hóa đơn này chưa
                ex = conn.execute(
                    text("SELECT soluong FROM ct_hoadon WHERE mahd = :mahd AND mamon = :mamon"),
                    {"mahd": mahd, "mamon": mamon}
                ).mappings().first()

                ghichu_item = str(it.get("ghichu") or "").strip()
                if ex:
                    conn.execute(
                        text("""
                            UPDATE ct_hoadon 
                            SET soluong = soluong + :sl, trangthai = 'ChoNau', thoigian_order = NOW(),
                                ghichu = CASE WHEN :gc != '' THEN :gc ELSE ghichu END
                            WHERE mahd = :mahd AND mamon = :mamon
                        """),
                        {"sl": soluong, "mahd": mahd, "mamon": mamon, "gc": ghichu_item}
                    )
                else:
                    conn.execute(
                        text("""
                            INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia, trangthai, thoigian_order, ghichu) 
                            VALUES (:mahd, :mamon, :sl, :dg, 'ChoNau', NOW(), :gc)
                        """),
                        {"mahd": mahd, "mamon": mamon, "sl": soluong, "dg": dongia, "gc": ghichu_item}
                    )

            # 3. Tính lại tổng tiền của hóa đơn
            tong = conn.execute(
                text("SELECT COALESCE(SUM(soluong * dongia), 0) FROM ct_hoadon WHERE mahd = :mahd"),
                {"mahd": mahd}
            ).scalar() or 0

            conn.execute(
                text("UPDATE hoadon SET tongtien = :tong WHERE mahd = :mahd"),
                {"tong": float(tong), "mahd": mahd}
            )

        return JSONResponse({
            "success": True,
            "mahd": mahd,
            "message": f"Đã gọi món thành công cho hóa đơn #{mahd}!"
        })

    except Exception as e:
        logger.error(f"Lỗi khi submit order: {e}")
        return JSONResponse({"success": False, "message": f"Lỗi: {str(e)}"}, status_code=500)


@router.post("/order/remove-item")
async def remove_order_item(request: Request):
    """Xóa một món khỏi hóa đơn đang mở."""
    try:
        data = await request.json()
        mahd = int(data.get("mahd"))
        mamon = int(data.get("mamon"))

        with engine.begin() as conn:
            conn.execute(
                text("DELETE FROM ct_hoadon WHERE mahd = :mahd AND mamon = :mamon"),
                {"mahd": mahd, "mamon": mamon}
            )
            # Tính lại tổng
            tong = conn.execute(
                text("SELECT COALESCE(SUM(soluong * dongia), 0) FROM ct_hoadon WHERE mahd = :mahd"),
                {"mahd": mahd}
            ).scalar() or 0

            conn.execute(
                text("UPDATE hoadon SET tongtien = :tong WHERE mahd = :mahd"),
                {"tong": float(tong), "mahd": mahd}
            )

        return JSONResponse({"success": True, "message": "Đã xóa món khỏi đơn!"})
    except Exception as e:
        return JSONResponse({"success": False, "message": str(e)}, status_code=500)
