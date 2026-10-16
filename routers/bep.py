import logging
from datetime import datetime
from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine

logger = logging.getLogger(__name__)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/bep", response_class=HTMLResponse)
def bep_dashboard(request: Request):
    """Màn hình điều phối Bếp (Kitchen Display System - KDS)."""
    cur_user = request.session.get("user") if "session" in request.scope else None
    
    # Cho phép Bếp, Quản lý, Admin vào xem
    return templates.TemplateResponse(
        request,
        "bep.html",
        {
            "cur_user": cur_user,
            "active_page": "bep"
        }
    )


@router.get("/api/bep/orders")
def api_get_bep_orders():
    """Lấy danh sách các đơn gọi món đang chờ chế biến (Realtime API cho Bếp)."""
    try:
        with engine.connect() as conn:
            # Lấy các món thuộc hóa đơn chưa thanh toán ('Cho')
            rows = conn.execute(text("""
                SELECT 
                    h.mahd AS MaHD,
                    h.maban AS MaBan,
                    b.tenban AS TenBan,
                    b.vitri AS KhuVuc,
                    h.ngaytao AS NgayTao,
                    ct.mamon AS MaMon,
                    m.tenmon AS TenMon,
                    m.hinhanh AS HinhAnh,
                    ct.soluong AS SoLuong,
                    COALESCE(ct.trangthai, 'ChoNau') AS TrangThai,
                    COALESCE(ct.ghichu, '') AS GhiChu,
                    COALESCE(ct.thoigian_order, h.ngaytao) AS ThoigianOrder
                FROM hoadon h
                JOIN banan b ON h.maban = b.maban
                JOIN ct_hoadon ct ON h.mahd = ct.mahd
                JOIN monan m ON ct.mamon = m.mamon
                WHERE h.trangthai = 'Cho' AND COALESCE(ct.trangthai, 'ChoNau') != 'DaXong'
                ORDER BY ct.thoigian_order ASC, h.mahd ASC
            """)).mappings().all()

            # Nhóm theo từng bàn / hóa đơn (Ticket)
            tickets_map = {}
            cho_nau_count = 0
            dang_nau_count = 0

            for r in rows:
                mahd = r["MaHD"]
                if mahd not in tickets_map:
                    tickets_map[mahd] = {
                        "mahd": mahd,
                        "maban": r["MaBan"],
                        "tenban": r["TenBan"],
                        "khuvuc": r["KhuVuc"],
                        "ngaytao": r["NgayTao"].strftime("%H:%M:%S") if r["NgayTao"] else "",
                        "items": []
                    }
                
                tt = r["TrangThai"]
                if tt == "ChoNau":
                    cho_nau_count += int(r["SoLuong"])
                elif tt == "DangNau":
                    dang_nau_count += int(r["SoLuong"])

                thoigian = r["ThoigianOrder"]
                time_str = thoigian.strftime("%H:%M:%S") if hasattr(thoigian, "strftime") else str(thoigian)

                tickets_map[mahd]["items"].append({
                    "mamon": r["MaMon"],
                    "tenmon": r["TenMon"],
                    "soluong": r["SoLuong"],
                    "hinhanh": r["HinhAnh"] or "/static/assets/img/dish_placeholder.svg",
                    "trangthai": tt,
                    "ghichu": r["GhiChu"],
                    "thoigian": time_str
                })

            # Lấy thống kê số món đã nấu xong hôm nay
            da_xong_count = conn.execute(text("""
                SELECT COALESCE(SUM(ct.soluong), 0)
                FROM ct_hoadon ct
                JOIN hoadon h ON ct.mahd = h.mahd
                WHERE ct.trangthai = 'DaXong' AND DATE(COALESCE(ct.thoigian_order, h.ngaytao)) = CURDATE()
            """)).scalar() or 0

            tickets = list(tickets_map.values())

            return JSONResponse({
                "tickets": tickets,
                "stats": {
                    "cho_nau": cho_nau_count,
                    "dang_nau": dang_nau_count,
                    "da_xong": int(da_xong_count),
                    "tong_ban_cho": len(tickets)
                },
                "server_time": datetime.now().strftime("%H:%M:%S")
            })

    except Exception as e:
        logger.error(f"Lỗi api_get_bep_orders: {e}")
        return JSONResponse({"error": str(e), "tickets": []}, status_code=500)


@router.post("/api/bep/update-dish-status")
async def api_update_dish_status(request: Request):
    """Cập nhật tiến độ nấu món ăn: ChoNau -> DangNau -> DaXong."""
    try:
        data = await request.json()
        mahd = int(data.get("mahd"))
        mamon = int(data.get("mamon"))
        trangthai = str(data.get("trangthai")).strip()

        if trangthai not in ["ChoNau", "DangNau", "DaXong"]:
            return JSONResponse({"success": False, "message": "Trạng thái không hợp lệ"}, status_code=400)

        with engine.begin() as conn:
            conn.execute(
                text("UPDATE ct_hoadon SET trangthai = :tt WHERE mahd = :hd AND mamon = :mon"),
                {"tt": trangthai, "hd": mahd, "mon": mamon}
            )

        return JSONResponse({"success": True, "trangthai": trangthai})
    except Exception as e:
        logger.error(f"Lỗi update dish status: {e}")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


@router.post("/api/bep/complete-ticket")
async def api_complete_ticket(request: Request):
    """Bếp trưởng bấm hoàn thành toàn bộ món của một bàn."""
    try:
        data = await request.json()
        mahd = int(data.get("mahd"))

        with engine.begin() as conn:
            conn.execute(
                text("UPDATE ct_hoadon SET trangthai = 'DaXong' WHERE mahd = :hd"),
                {"hd": mahd}
            )

        return JSONResponse({"success": True, "message": "Đã hoàn thành toàn bộ bàn!"})
    except Exception as e:
        logger.error(f"Lỗi complete ticket: {e}")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)
