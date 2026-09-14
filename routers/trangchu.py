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
    with engine.connect() as conn:
        tong_ban = conn.execute(text("SELECT COUNT(*) FROM ban")).scalar()
        tong_monan = conn.execute(text("SELECT COUNT(*) FROM monan")).scalar()
        tong_hoadon = conn.execute(text("SELECT COUNT(*) FROM hoadon")).scalar()
        doanhthu = conn.execute(text("SELECT COALESCE(SUM(TongTien),0) FROM hoadon WHERE TrangThai='Da thanh toan'")).scalar()
        bans = conn.execute(text("SELECT MaBan, TenBan, TrangThai FROM ban")).fetchall()
        recent_hds = conn.execute(text(
            "SELECT h.MaHD, h.TongTien, h.TrangThai, b.TenBan "
            "FROM hoadon h LEFT JOIN ban b ON h.MaBan=b.MaBan "
            "ORDER BY h.MaHD DESC LIMIT 5"
        )).fetchall()
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
            ban = conn.execute(text("SELECT * FROM ban WHERE MaBan=:id"), {"id": ma_ban}).fetchone()
            if not ban:
                return JSONResponse({"error": "Khong tim thay ban"}, status_code=404)

            ban_info = serialize_row(ban)

            datban_rows = conn.execute(text("""
                SELECT db.*, kh.HoTen AS TenKH, kh.SDT, kh.Email
                FROM datban db
                LEFT JOIN khachhang kh ON db.MaKH = kh.MaKH
                WHERE db.MaBan = :id
                ORDER BY db.NgayDat DESC
            """), {"id": ma_ban}).fetchall()
            datban_list = [serialize_row(r) for r in datban_rows]

            hoadon_rows = conn.execute(text("""
                SELECT h.*, nv.HoTen AS TenNV
                FROM hoadon h
                LEFT JOIN nhanvien nv ON h.MaNV = nv.MaNV
                WHERE h.MaBan = :id
                ORDER BY h.MaHD DESC
            """), {"id": ma_ban}).fetchall()
            hoadon_list = []
            for hd in hoadon_rows:
                hd_dict = serialize_row(hd)
                cthd = conn.execute(text("""
                    SELECT ct.*, m.TenMon
                    FROM chitiethoadon ct
                    LEFT JOIN monan m ON ct.MaMon = m.MaMon
                    WHERE ct.MaHD = :mahd
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
