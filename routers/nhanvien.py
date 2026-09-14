from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/nhanvien", response_class=HTMLResponse)
def list_nhanvien(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM nhanvien ORDER BY MaNV"))
            items = result.fetchall()
        return templates.TemplateResponse(request, "nhanvien.html", {"items": items, "active_page": "nhanvien"})
    except Exception as e:
        return templates.TemplateResponse(request, "nhanvien.html", {"error": str(e), "items": [], "active_page": "nhanvien"})


@router.get("/nhanvien/add", response_class=HTMLResponse)
def add_nhanvien_form(request: Request):
    return templates.TemplateResponse(request, "nhanvien_add.html", {"active_page": "nhanvien"})


@router.post("/nhanvien/add")
def add_nhanvien(
    HoTen: str = Form(...), SDT: str = Form(""), Email: str = Form(""),
    ChucVu: str = Form(...), Username: str = Form(...), Password: str = Form(...),
    GioiTinh: str = Form("Nam"), DiaChi: str = Form("")
):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO nhanvien (HoTen, GioiTinh, SDT, Email, DiaChi, ChucVu, Username, Password, TrangThai) VALUES (:hoten, :gt, :sdt, :email, :dc, :cv, :user, :pass, 'Dang lam')"),
                {"hoten": HoTen, "gt": GioiTinh, "sdt": SDT, "email": Email, "dc": DiaChi, "cv": ChucVu, "user": Username, "pass": Password}
            )
            conn.commit()
    except Exception as e:
        return RedirectResponse(url="/nhanvien/add", status_code=303)
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/nhanvien/edit/{id}", response_class=HTMLResponse)
def edit_nhanvien_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM nhanvien WHERE MaNV = :id"), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/nhanvien", status_code=303)
        return templates.TemplateResponse(request, "nhanvien_edit.html", {"item": item, "active_page": "nhanvien"})
    except Exception:
        return RedirectResponse(url="/nhanvien", status_code=303)


@router.post("/nhanvien/edit/{id}")
def edit_nhanvien(
    id: int, HoTen: str = Form(...), SDT: str = Form(""), Email: str = Form(""),
    ChucVu: str = Form(...), GioiTinh: str = Form("Nam"), DiaChi: str = Form(""),
    TrangThai: str = Form("Dang lam")
):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE nhanvien SET HoTen=:hoten, GioiTinh=:gt, SDT=:sdt, Email=:email, DiaChi=:dc, ChucVu=:cv, TrangThai=:tt WHERE MaNV=:id"),
                {"hoten": HoTen, "gt": GioiTinh, "sdt": SDT, "email": Email, "dc": DiaChi, "cv": ChucVu, "tt": TrangThai, "id": id}
            )
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/nhanvien/delete/{id}")
def delete_nhanvien(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM nhanvien WHERE MaNV = :id"), {"id": id})
            conn.commit()
    except Exception:
        pass
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/api/nhanvien")
def api_nhanvien():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM nhanvien ORDER BY MaNV"))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}
