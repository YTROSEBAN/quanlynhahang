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
            result = conn.execute(text("""
                SELECT nv.manv AS MaNV, nv.hoten AS HoTen, nv.gioitinh AS GioiTinh, nv.sodienthoai AS SDT,
                       nv.email AS Email, nv.diachi AS DiaChi, COALESCE(cv.tencv, 'Nhân viên') AS ChucVu,
                       tk.tendangnhap AS Username, tk.matkhau AS Password, 'Dang lam' AS TrangThai
                FROM nhanvien nv
                LEFT JOIN chucvu cv ON nv.macv = cv.macv
                LEFT JOIN taikhoan tk ON nv.manv = tk.manv
                ORDER BY nv.manv
            """))
            items = result.fetchall()
        return templates.TemplateResponse(request, "nhanvien.html", {"items": items, "active_page": "nhanvien"})
    except Exception as e:
        print("Lỗi list_nhanvien:", e)
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
            cv_row = conn.execute(text("SELECT macv FROM chucvu WHERE tencv=:cv"), {"cv": ChucVu}).fetchone()
            if cv_row:
                macv = cv_row.macv
            else:
                cv_any = conn.execute(text("SELECT macv FROM chucvu LIMIT 1")).fetchone()
                if cv_any:
                    macv = cv_any.macv
                else:
                    conn.execute(text("INSERT INTO chucvu (tencv) VALUES (:cv)"), {"cv": ChucVu})
                    macv = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()

            gt = "Nam" if GioiTinh.lower() in ("nam", "male") else "Nu"
            conn.execute(
                text("INSERT INTO nhanvien (hoten, gioitinh, sodienthoai, email, diachi, macv, ngayvaolam) VALUES (:hoten, :gt, :sdt, :email, :dc, :macv, CURDATE())"),
                {"hoten": HoTen, "gt": gt, "sdt": SDT, "email": Email, "dc": DiaChi, "macv": macv}
            )
            manv = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
            if Username and Password:
                conn.execute(
                    text("INSERT INTO taikhoan (tendangnhap, matkhau, trangthai, manv) VALUES (:u, :p, 1, :manv)"),
                    {"u": Username, "p": Password, "manv": manv}
                )
            conn.commit()
    except Exception as e:
        print("Lỗi add_nhanvien:", e)
        return RedirectResponse(url="/nhanvien/add", status_code=303)
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/nhanvien/edit/{id}", response_class=HTMLResponse)
def edit_nhanvien_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT nv.manv AS MaNV, nv.hoten AS HoTen, nv.gioitinh AS GioiTinh, nv.sodienthoai AS SDT,
                       nv.email AS Email, nv.diachi AS DiaChi, COALESCE(cv.tencv, 'Nhân viên') AS ChucVu,
                       'Dang lam' AS TrangThai
                FROM nhanvien nv
                LEFT JOIN chucvu cv ON nv.macv = cv.macv
                WHERE nv.manv = :id
            """), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/nhanvien", status_code=303)
        return templates.TemplateResponse(request, "nhanvien_edit.html", {"item": item, "active_page": "nhanvien"})
    except Exception as e:
        print("Lỗi edit_nhanvien_form:", e)
        return RedirectResponse(url="/nhanvien", status_code=303)


@router.post("/nhanvien/edit/{id}")
def edit_nhanvien(
    id: int, HoTen: str = Form(...), SDT: str = Form(""), Email: str = Form(""),
    ChucVu: str = Form(...), GioiTinh: str = Form("Nam"), DiaChi: str = Form(""),
    TrangThai: str = Form("Dang lam")
):
    try:
        with engine.connect() as conn:
            cv_row = conn.execute(text("SELECT macv FROM chucvu WHERE tencv=:cv"), {"cv": ChucVu}).fetchone()
            macv = cv_row.macv if cv_row else None
            gt = "Nam" if GioiTinh.lower() in ("nam", "male") else "Nu"
            
            if macv:
                conn.execute(
                    text("UPDATE nhanvien SET hoten=:hoten, gioitinh=:gt, sodienthoai=:sdt, email=:email, diachi=:dc, macv=:macv WHERE manv=:id"),
                    {"hoten": HoTen, "gt": gt, "sdt": SDT, "email": Email, "dc": DiaChi, "macv": macv, "id": id}
                )
            else:
                conn.execute(
                    text("UPDATE nhanvien SET hoten=:hoten, gioitinh=:gt, sodienthoai=:sdt, email=:email, diachi=:dc WHERE manv=:id"),
                    {"hoten": HoTen, "gt": gt, "sdt": SDT, "email": Email, "dc": DiaChi, "id": id}
                )
            conn.commit()
    except Exception as e:
        print("Lỗi edit_nhanvien:", e)
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/nhanvien/delete/{id}")
def delete_nhanvien(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM taikhoan WHERE manv = :id"), {"id": id})
            conn.execute(text("DELETE FROM nhanvien WHERE manv = :id"), {"id": id})
            conn.commit()
    except Exception as e:
        print("Lỗi delete_nhanvien:", e)
    return RedirectResponse(url="/nhanvien", status_code=303)


@router.get("/api/nhanvien")
def api_nhanvien():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT nv.manv AS MaNV, nv.hoten AS HoTen, nv.gioitinh AS GioiTinh, nv.sodienthoai AS SDT,
                       nv.email AS Email, nv.diachi AS DiaChi, COALESCE(cv.tencv, 'Nhân viên') AS ChucVu
                FROM nhanvien nv
                LEFT JOIN chucvu cv ON nv.macv = cv.macv
                ORDER BY nv.manv
            """))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}
