from fastapi import APIRouter, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine
import shutil, os

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/monan", response_class=HTMLResponse)
def list_monan(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT m.mamon AS MaMon, m.tenmon AS TenMon, m.gia AS DonGia, 'Phần' AS DonViTinh, 
                       m.hinhanh AS HinhAnh, m.mota AS MoTa, m.madm AS MaDM,
                       CASE WHEN m.trangthai = 1 THEN 'Con ban' ELSE 'Het mon' END AS TrangThai,
                       d.tendm AS ten_danhmuc 
                FROM monan m LEFT JOIN danhmuc d ON m.madm = d.madm 
                ORDER BY m.mamon
            """))
            items = result.fetchall()
            dm = conn.execute(text("SELECT madm AS id, tendm AS ten_danhmuc FROM danhmuc")).fetchall()
        return templates.TemplateResponse(request, "monan.html", {"items": items, "danhmuc": dm, "active_page": "monan"})
    except Exception as e:
        print("Lỗi list_monan:", e)
        return templates.TemplateResponse(request, "monan.html", {"error": str(e), "items": [], "danhmuc": [], "active_page": "monan"})


@router.get("/monan/add", response_class=HTMLResponse)
def add_monan_form(request: Request):
    try:
        with engine.connect() as conn:
            dm = conn.execute(text("SELECT madm AS id, tendm AS ten_danhmuc FROM danhmuc")).fetchall()
        return templates.TemplateResponse(request, "monan_add.html", {"danhmuc": dm, "active_page": "monan"})
    except Exception as e:
        print("Lỗi add_monan_form:", e)
        return RedirectResponse(url="/monan", status_code=303)


@router.post("/monan/add")
async def add_monan(
    TenMon: str = Form(...), DonGia: float = Form(...), MaDM: int = Form(...),
    DonViTinh: str = Form("Phan"), MoTa: str = Form(""), Image: UploadFile = File(None)
):
    image_path = ""
    if Image and Image.filename:
        ext = os.path.splitext(Image.filename)[1]
        filename = f"upload_{os.urandom(4).hex()}{ext}"
        filepath = os.path.join("static", "uploads", filename)
        os.makedirs(os.path.join("static", "uploads"), exist_ok=True)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(Image.file, f)
        image_path = f"/static/uploads/{filename}"
    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO monan (tenmon, gia, hinhanh, mota, madm, trangthai) VALUES (:ten, :gia, :hinh, :mota, :madm, 1)"),
                {"ten": TenMon, "gia": DonGia, "hinh": image_path, "mota": MoTa, "madm": MaDM}
            )
            conn.commit()
    except Exception as e:
        print("Lỗi add_monan:", e)
    return RedirectResponse(url="/monan", status_code=303)


@router.get("/monan/edit/{id}", response_class=HTMLResponse)
def edit_monan_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT m.mamon AS MaMon, m.tenmon AS TenMon, m.gia AS DonGia, 'Phần' AS DonViTinh, 
                       m.hinhanh AS HinhAnh, m.mota AS MoTa, m.madm AS MaDM,
                       CASE WHEN m.trangthai = 1 THEN 'Con ban' ELSE 'Het mon' END AS TrangThai
                FROM monan m WHERE m.mamon = :id
            """), {"id": id})
            item = result.fetchone()
            dm = conn.execute(text("SELECT madm AS id, tendm AS ten_danhmuc FROM danhmuc")).fetchall()
        if item is None:
            return RedirectResponse(url="/monan", status_code=303)
        return templates.TemplateResponse(request, "monan_edit.html", {"item": item, "danhmuc": dm, "active_page": "monan"})
    except Exception as e:
        print("Lỗi edit_monan_form:", e)
        return RedirectResponse(url="/monan", status_code=303)


@router.post("/monan/edit/{id}")
async def edit_monan(
    id: int, TenMon: str = Form(...), DonGia: float = Form(...), MaDM: int = Form(...),
    DonViTinh: str = Form(""), MoTa: str = Form(""), TrangThai: str = Form("Con ban"),
    Image: UploadFile = File(None)
):
    image_path = None
    if Image and Image.filename:
        ext = os.path.splitext(Image.filename)[1]
        filename = f"upload_{os.urandom(4).hex()}{ext}"
        filepath = os.path.join("static", "uploads", filename)
        os.makedirs(os.path.join("static", "uploads"), exist_ok=True)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(Image.file, f)
        image_path = f"/static/uploads/{filename}"
    try:
        tt_val = 1 if TrangThai in ("Con ban", "Còn bán", "1", 1) else 0
        with engine.connect() as conn:
            if image_path:
                conn.execute(
                    text("UPDATE monan SET tenmon=:ten, gia=:gia, hinhanh=:hinh, mota=:mota, madm=:madm, trangthai=:tt WHERE mamon=:id"),
                    {"ten": TenMon, "gia": DonGia, "hinh": image_path, "mota": MoTa, "madm": MaDM, "tt": tt_val, "id": id}
                )
            else:
                conn.execute(
                    text("UPDATE monan SET tenmon=:ten, gia=:gia, mota=:mota, madm=:madm, trangthai=:tt WHERE mamon=:id"),
                    {"ten": TenMon, "gia": DonGia, "mota": MoTa, "madm": MaDM, "tt": tt_val, "id": id}
                )
            conn.commit()
    except Exception as e:
        print("Lỗi edit_monan:", e)
    return RedirectResponse(url="/monan", status_code=303)


@router.get("/monan/delete/{id}")
def delete_monan(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM monan WHERE mamon = :id"), {"id": id})
            conn.commit()
    except Exception as e:
        print("Lỗi delete_monan:", e)
    return RedirectResponse(url="/monan", status_code=303)


@router.get("/api/monan")
def api_monan():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT m.mamon AS MaMon, m.tenmon AS TenMon, m.gia AS DonGia, 'Phần' AS DonViTinh, 
                       m.hinhanh AS HinhAnh, m.mota AS MoTa, m.madm AS MaDM,
                       CASE WHEN m.trangthai = 1 THEN 'Con ban' ELSE 'Het mon' END AS TrangThai,
                       d.tendm AS ten_danhmuc 
                FROM monan m LEFT JOIN danhmuc d ON m.madm = d.madm 
                ORDER BY m.mamon
            """))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}


@router.get("/api/danhmuc")
def api_danhmuc():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT madm AS id, tendm AS ten_danhmuc, mota AS MoTa FROM danhmuc"))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}
