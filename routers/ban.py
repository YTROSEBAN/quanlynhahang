from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/ban", response_class=HTMLResponse)
def list_ban(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM ban ORDER BY MaBan"))
            items = result.fetchall()
        return templates.TemplateResponse(request, "ban.html", {"items": items, "active_page": "ban"})
    except Exception as e:
        return templates.TemplateResponse(request, "ban.html", {"error": str(e), "items": [], "active_page": "ban"})


@router.post("/ban/add")
def add_ban(TenBan: str = Form(...), KhuVuc: str = Form("A"), SucChua: int = Form(4)):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO ban (TenBan, KhuVuc, SucChua, TrangThai) VALUES (:ten, :khu, :suc, 'Trong')"),
                {"ten": TenBan, "khu": KhuVuc, "suc": SucChua}
            )
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/ban/edit/{id}", response_class=HTMLResponse)
def edit_ban_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM ban WHERE MaBan = :id"), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/ban", status_code=303)
        return templates.TemplateResponse(request, "ban_edit.html", {"item": item, "active_page": "ban"})
    except Exception:
        return RedirectResponse(url="/ban", status_code=303)


@router.post("/ban/edit/{id}")
def edit_ban(id: int, TenBan: str = Form(...), KhuVuc: str = Form(...), SucChua: int = Form(...), TrangThai: str = Form(...)):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE ban SET TenBan=:ten, KhuVuc=:khu, SucChua=:suc, TrangThai=:tt WHERE MaBan=:id"),
                {"ten": TenBan, "khu": KhuVuc, "suc": SucChua, "tt": TrangThai, "id": id}
            )
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/ban/delete/{id}")
def delete_ban(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM ban WHERE MaBan = :id"), {"id": id})
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/ban", status_code=303)


@router.get("/api/ban")
def api_ban():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM ban ORDER BY MaBan"))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}


@router.post("/ban/trangthai/{id}")
def update_trangthai(id: int, TrangThai: str = Form(...)):
    try:
        with engine.connect() as conn:
            conn.execute(text("UPDATE ban SET TrangThai=:tt WHERE MaBan=:id"), {"tt": TrangThai, "id": id})
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/ban", status_code=303)
