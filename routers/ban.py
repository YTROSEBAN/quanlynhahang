from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine

router = APIRouter()
templates = Jinja2Templates(directory="templates")

def normalize_status(tt: str) -> str:
    mapping = {
        'Trong': 'Trong',
        'Da dat': 'DaDat',
        'DaDat': 'DaDat',
        'Đã đặt': 'DaDat',
        'Dang su dung': 'DangSuDung',
        'DangSuDung': 'DangSuDung',
        'Đang sử dụng': 'DangSuDung',
        'Dang phuc vu': 'DangSuDung'
    }
    return mapping.get(tt, 'Trong')


@router.get("/ban", response_class=HTMLResponse)
def list_ban(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, sachogoi AS SucChua, 
                       CASE 
                           WHEN trangthai = 'DangSuDung' THEN 'Dang su dung'
                           WHEN trangthai = 'DaDat' THEN 'Da dat'
                           ELSE 'Trong'
                       END AS TrangThai 
                FROM banan ORDER BY maban
            """))
            items = result.fetchall()
        return templates.TemplateResponse(request, "ban.html", {"items": items, "active_page": "ban"})
    except Exception as e:
        return templates.TemplateResponse(request, "ban.html", {"error": str(e), "items": [], "active_page": "ban"})


@router.post("/ban/add")
def add_ban(TenBan: str = Form(...), KhuVuc: str = Form("A"), SucChua: int = Form(4)):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO banan (tenban, vitri, sachogoi, trangthai) VALUES (:ten, :khu, :suc, 'Trong')"),
                {"ten": TenBan, "khu": KhuVuc, "suc": SucChua}
            )
            conn.commit()
    except Exception as e:
        print("Lỗi add_ban:", e)
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/ban/edit/{id}", response_class=HTMLResponse)
def edit_ban_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, sachogoi AS SucChua,
                       CASE 
                           WHEN trangthai = 'DangSuDung' THEN 'Dang su dung'
                           WHEN trangthai = 'DaDat' THEN 'Da dat'
                           ELSE 'Trong'
                       END AS TrangThai 
                FROM banan WHERE maban = :id
            """), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/ban", status_code=303)
        return templates.TemplateResponse(request, "ban_edit.html", {"item": item, "active_page": "ban"})
    except Exception as e:
        print("Lỗi edit_ban_form:", e)
        return RedirectResponse(url="/ban", status_code=303)


@router.post("/ban/edit/{id}")
def edit_ban(id: int, TenBan: str = Form(...), KhuVuc: str = Form(...), SucChua: int = Form(...), TrangThai: str = Form(...)):
    try:
        tt_db = normalize_status(TrangThai)
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE banan SET tenban=:ten, vitri=:khu, sachogoi=:suc, trangthai=:tt WHERE maban=:id"),
                {"ten": TenBan, "khu": KhuVuc, "suc": SucChua, "tt": tt_db, "id": id}
            )
            conn.commit()
    except Exception as e:
        print("Lỗi edit_ban:", e)
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/ban/delete/{id}")
def delete_ban(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM banan WHERE maban = :id"), {"id": id})
            conn.commit()
    except Exception as e:
        print("Lỗi delete_ban:", e)
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/api/ban")
def api_ban():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT maban AS MaBan, tenban AS TenBan, vitri AS KhuVuc, sachogoi AS SucChua, 
                       CASE 
                           WHEN trangthai = 'DangSuDung' THEN 'Dang su dung'
                           WHEN trangthai = 'DaDat' THEN 'Da dat'
                           ELSE 'Trong'
                       END AS TrangThai 
                FROM banan ORDER BY maban
            """))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}


@router.post("/ban/trangthai/{id}")
def update_trangthai(id: int, TrangThai: str = Form(...)):
    try:
        tt_db = normalize_status(TrangThai)
        with engine.connect() as conn:
            conn.execute(text("UPDATE banan SET trangthai=:tt WHERE maban=:id"), {"tt": tt_db, "id": id})
            conn.commit()
    except Exception as e:
        print("Lỗi update_trangthai:", e)
    return RedirectResponse(url="/ban", status_code=303)
