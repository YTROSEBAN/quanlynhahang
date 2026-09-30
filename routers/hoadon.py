import logging

from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from io import BytesIO

logger = logging.getLogger(__name__)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/hoadon", response_class=HTMLResponse)
def list_hoadon(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT h.mahd AS MaHD, h.ngaytao AS NgayLap, 
                       COALESCE(h.tongthanhtoan, h.tongtien, 0) AS TongTien,
                       h.giamgia AS GiamGia, COALESCE(h.tongthanhtoan, h.tongtien, 0) AS ThanhTien,
                       CASE WHEN h.trangthai = 'DaThanhToan' THEN 'Da thanh toan' ELSE 'Dang phuc vu' END AS TrangThai,
                       b.tenban AS TenBan, nv.hoten AS HoTen, kh.hoten AS TenKH
                FROM hoadon h 
                LEFT JOIN banan b ON h.maban = b.maban 
                LEFT JOIN nhanvien nv ON h.manv = nv.manv
                LEFT JOIN khachhang kh ON h.makh = kh.makh
                ORDER BY h.mahd DESC
            """))
            items = result.fetchall()
            bans = conn.execute(text("SELECT maban AS MaBan, tenban AS TenBan FROM banan")).fetchall()
            nhanviens = conn.execute(text("SELECT manv AS MaNV, hoten AS HoTen FROM nhanvien")).fetchall()
            monans = conn.execute(text("SELECT mamon AS MaMon, tenmon AS TenMon, gia AS DonGia FROM monan")).fetchall()
        return templates.TemplateResponse(request, "hoadon.html", {"items": items, "bans": bans, "nhanviens": nhanviens, "monans": monans, "active_page": "hoadon"})
    except Exception as e:
        print("Lỗi list_hoadon:", e)
        return templates.TemplateResponse(request, "hoadon.html", {"error": str(e), "items": [], "bans": [], "nhanviens": [], "monans": [], "active_page": "hoadon"})


@router.post("/hoadon/add")
def add_hoadon(
    MaBan: int = Form(...), MaNV: int = Form(...),
    MaMon: list = Form([]), SoLuong: list = Form([])
):
    try:
        tong = 0
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO hoadon (manv, maban, tongtien, trangthai) VALUES (:manv, :maban, 0, 'Cho')"),
                {"manv": MaNV, "maban": MaBan}
            )
            ma_hd = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
            for i in range(len(MaMon)):
                mon = conn.execute(text("SELECT gia FROM monan WHERE mamon=:id"), {"id": MaMon[i]}).fetchone()
                sl = int(SoLuong[i]) if i < len(SoLuong) else 1
                if mon:
                    thanh_tien = float(mon.gia) * sl
                    tong += thanh_tien
                    conn.execute(
                        text("INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia) VALUES (:hd, :mon, :sl, :dg)"),
                        {"hd": ma_hd, "mon": MaMon[i], "sl": sl, "dg": mon.gia}
                    )
            conn.execute(
                text("UPDATE hoadon SET tongtien=:tong WHERE mahd=:id"),
                {"tong": tong, "id": ma_hd}
            )
            conn.execute(text("UPDATE banan SET trangthai='DangSuDung' WHERE maban=:id"), {"id": MaBan})
            conn.commit()
<<<<<<< Updated upstream
    except Exception as e:
        print("Lỗi add_hoadon:", e)
=======
    except Exception:
        logger.exception('LOI tai dong 64')
>>>>>>> Stashed changes
    return RedirectResponse(url="/hoadon", status_code=303)


@router.get("/hoadon/delete/{id}")
def delete_hoadon(id: int):
    try:
        with engine.connect() as conn:
            hd = conn.execute(text("SELECT maban FROM hoadon WHERE mahd=:id"), {"id": id}).fetchone()
            if hd and hd.maban:
                conn.execute(text("UPDATE banan SET trangthai='Trong' WHERE maban=:id"), {"id": hd.maban})
            conn.execute(text("DELETE FROM ct_hoadon WHERE mahd = :id"), {"id": id})
            conn.execute(text("DELETE FROM hoadon WHERE mahd = :id"), {"id": id})
            conn.commit()
<<<<<<< Updated upstream
    except Exception as e:
        print("Lỗi delete_hoadon:", e)
=======
    except Exception:
        logger.exception('LOI tai dong 79')
>>>>>>> Stashed changes
    return RedirectResponse(url="/hoadon", status_code=303)


@router.get("/hoadon/thanhtoan/{id}")
def thanh_toan(id: int):
    try:
        with engine.connect() as conn:
            hd = conn.execute(text("SELECT maban FROM hoadon WHERE mahd=:id"), {"id": id}).fetchone()
            if hd and hd.maban:
                conn.execute(text("UPDATE banan SET trangthai='Trong' WHERE maban=:id"), {"id": hd.maban})
            conn.execute(text("UPDATE hoadon SET trangthai='DaThanhToan' WHERE mahd=:id"), {"id": id})
            conn.commit()
<<<<<<< Updated upstream
    except Exception as e:
        print("Lỗi thanh_toan:", e)
=======
    except Exception:
        logger.exception('LOI tai dong 93')
>>>>>>> Stashed changes
    return RedirectResponse(url="/hoadon", status_code=303)


@router.get("/hoadon/xuat/{id}", response_class=HTMLResponse)
def xuat_hoadon(request: Request, id: int):
    try:
        with engine.connect() as conn:
            hd = conn.execute(text("""
                SELECT h.mahd AS MaHD, h.ngaytao AS NgayLap, 
                       COALESCE(h.tongthanhtoan, h.tongtien, 0) AS TongTien,
                       h.giamgia AS GiamGia, COALESCE(h.tongthanhtoan, h.tongtien, 0) AS ThanhTien,
                       CASE WHEN h.trangthai = 'DaThanhToan' THEN 'Da thanh toan' ELSE 'Dang phuc vu' END AS TrangThai,
                       b.tenban AS TenBan, nv.hoten AS TenNV, kh.hoten AS TenKH
                FROM hoadon h
                LEFT JOIN banan b ON h.maban = b.maban
                LEFT JOIN nhanvien nv ON h.manv = nv.manv
                LEFT JOIN khachhang kh ON h.makh = kh.makh
                WHERE h.mahd = :id
            """), {"id": id}).fetchone()
            if hd is None:
                return RedirectResponse(url="/hoadon", status_code=303)
            chitiet = conn.execute(text("""
                SELECT ct.mahd AS MaHD, ct.mamon AS MaMon, ct.soluong AS SoLuong, ct.dongia AS DonGia,
                       COALESCE(ct.thanhtien, ct.soluong * ct.dongia) AS ThanhTien, m.tenmon AS TenMon
                FROM ct_hoadon ct
                LEFT JOIN monan m ON ct.mamon = m.mamon
                WHERE ct.mahd = :id
            """), {"id": id}).fetchall()
        return templates.TemplateResponse(request, "hoadon_in.html", {"hd": hd, "chitiet": chitiet})
    except Exception as e:
        print("Lỗi xuat_hoadon:", e)
        return RedirectResponse(url="/hoadon", status_code=303)


@router.get("/hoadon/excel/{id}")
def xuat_excel(id: int):
    try:
        with engine.connect() as conn:
            hd = conn.execute(text("""
                SELECT h.mahd AS MaHD, h.ngaytao AS NgayLap, 
                       COALESCE(h.tongthanhtoan, h.tongtien, 0) AS TongTien,
                       h.giamgia AS GiamGia, COALESCE(h.tongthanhtoan, h.tongtien, 0) AS ThanhTien,
                       CASE WHEN h.trangthai = 'DaThanhToan' THEN 'Da thanh toan' ELSE 'Dang phuc vu' END AS TrangThai,
                       b.tenban AS TenBan, nv.hoten AS TenNV, kh.hoten AS TenKH
                FROM hoadon h
                LEFT JOIN banan b ON h.maban = b.maban
                LEFT JOIN nhanvien nv ON h.manv = nv.manv
                LEFT JOIN khachhang kh ON h.makh = kh.makh
                WHERE h.mahd = :id
            """), {"id": id}).fetchone()
            chitiet = conn.execute(text("""
                SELECT ct.mahd AS MaHD, ct.mamon AS MaMon, ct.soluong AS SoLuong, ct.dongia AS DonGia,
                       COALESCE(ct.thanhtien, ct.soluong * ct.dongia) AS ThanhTien, m.tenmon AS TenMon
                FROM ct_hoadon ct
                LEFT JOIN monan m ON ct.mamon = m.mamon
                WHERE ct.mahd = :id
            """), {"id": id}).fetchall()

        wb = Workbook()
        ws = wb.active
        ws.title = f"HoaDon_{id}"

        thin = Side(style='thin', color='CCCCCC')
        medium = Side(style='medium', color='2F5496')
        border_all = Border(left=thin, right=thin, top=thin, bottom=thin)
        border_header = Border(left=thin, right=thin, top=medium, bottom=medium)
        border_bottom = Border(bottom=medium)

        center = Alignment(horizontal='center', vertical='center')
        right = Alignment(horizontal='right', vertical='center')
        fill_title = PatternFill(start_color='2F5496', end_color='2F5496', fill_type='solid')
        fill_header = PatternFill(start_color='4472C4', end_color='4472C4', fill_type='solid')
        fill_alt = PatternFill(start_color='D6E4F0', end_color='D6E4F0', fill_type='solid')
        fill_total = PatternFill(start_color='FFF2CC', end_color='FFF2CC', fill_type='solid')
        fill_success = PatternFill(start_color='E2EFDA', end_color='E2EFDA', fill_type='solid')

        font_title = Font(bold=True, size=18, color='FFFFFF')
        font_subtitle = Font(bold=True, size=11, color='8DB4E2')
        font_bold = Font(bold=True, size=11)
        font_normal = Font(size=11)
        font_header_white = Font(bold=True, size=11, color='FFFFFF')
        font_total = Font(bold=True, size=13, color='C00000')

        ws.column_dimensions['A'].width = 4
        ws.column_dimensions['B'].width = 32
        ws.column_dimensions['C'].width = 12
        ws.column_dimensions['D'].width = 20
        ws.column_dimensions['E'].width = 22

        ws.merge_cells('A1:E1')
        title_cell = ws['A1']
        title_cell.value = 'NHÀ HÀNG'
        title_cell.font = font_title
        title_cell.fill = fill_title
        title_cell.alignment = center
        ws.row_dimensions[1].height = 40

        ws.merge_cells('A2:E2')
        sub = ws['A2']
        sub.value = 'HÓA ĐƠN BÁN HÀNG'
        sub.font = font_subtitle
        sub.fill = fill_title
        sub.alignment = center
        ws.row_dimensions[2].height = 25

        for col in range(1, 6):
            ws.cell(row=1, column=col).fill = fill_title
            ws.cell(row=2, column=col).fill = fill_title

        row = 4
        info_data = [
            ('📋 Số HĐ:', f'#{hd.MaHD}'),
            ('📅 Ngày lập:', hd.NgayLap.strftime('%d/%m/%Y %H:%M') if hd.NgayLap else 'N/A'),
            ('🪑 Bàn:', hd.TenBan or 'N/A'),
            ('👤 Nhân viên:', hd.TenNV or 'N/A'),
            ('🏠 Khách hàng:', hd.TenKH or 'Khách lẻ'),
        ]
        for label, val in info_data:
            c1 = ws.cell(row=row, column=1, value=label)
            c1.font = font_bold
            c2 = ws.cell(row=row, column=2, value=val)
            c2.font = font_normal
            row += 1

        row += 1
        ws.merge_cells(f'A{row}:E{row}')
        sep = ws.cell(row=row, column=1)
        sep.border = border_bottom
        for c in range(1, 6):
            ws.cell(row=row, column=c).border = Border(bottom=Side(style='thin', color='4472C4'))
        row += 1

        headers = ['STT', 'MÓN ĂN', 'SỐ LƯỢNG', 'ĐƠN GIÁ (₫)', 'THÀNH TIỀN (₫)']
        for col, h in enumerate(headers, 1):
            cell = ws.cell(row=row, column=col, value=h)
            cell.font = font_header_white
            cell.fill = fill_header
            cell.border = border_header
            cell.alignment = center
        ws.row_dimensions[row].height = 28
        row += 1

        for i, c in enumerate(chitiet, 1):
            is_alt = i % 2 == 0
            row_fill = fill_alt if is_alt else None

            ws.cell(row=row, column=1, value=i).border = border_all
            ws.cell(row=row, column=1).alignment = center
            ws.cell(row=row, column=1).font = font_bold
            if row_fill: ws.cell(row=row, column=1).fill = row_fill

            ws.cell(row=row, column=2, value=c.TenMon).border = border_all
            ws.cell(row=row, column=2).font = font_normal
            if row_fill: ws.cell(row=row, column=2).fill = row_fill

            ws.cell(row=row, column=3, value=c.SoLuong).border = border_all
            ws.cell(row=row, column=3).alignment = center
            ws.cell(row=row, column=3).font = font_normal
            if row_fill: ws.cell(row=row, column=3).fill = row_fill

            dg = ws.cell(row=row, column=4, value=float(c.DonGia))
            dg.border = border_all
            dg.number_format = '#,##0'
            dg.alignment = right
            dg.font = font_normal
            if row_fill: dg.fill = row_fill

            tt = ws.cell(row=row, column=5, value=float(c.ThanhTien))
            tt.border = border_all
            tt.number_format = '#,##0'
            tt.alignment = right
            tt.font = Font(bold=True, size=11, color='C00000' if float(c.ThanhTien) > 500000 else '333333')
            if row_fill: tt.fill = row_fill

            ws.row_dimensions[row].height = 24
            row += 1

        row += 1
        ws.merge_cells(f'A{row}:C{row}')

        total_label = ws.cell(row=row, column=4, value='TỔNG CỘNG:')
        total_label.font = Font(bold=True, size=12)
        total_label.alignment = right
        total_label.fill = fill_total

        total_val = ws.cell(row=row, column=5, value=float(hd.TongTien))
        total_val.font = font_total
        total_val.number_format = '#,##0 ₫'
        total_val.alignment = right
        total_val.fill = fill_total

        for c in range(4, 6):
            ws.cell(row=row, column=c).border = Border(
                top=Side(style='medium', color='C00000'),
                bottom=Side(style='double', color='C00000')
            )
        ws.row_dimensions[row].height = 30

        buf = BytesIO()
        wb.save(buf)
        buf.seek(0)

        filename = f"HoaDon_{id}.xlsx"
        return StreamingResponse(
            buf,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        print("Lỗi xuat_excel:", e)
        return RedirectResponse(url="/hoadon", status_code=303)


@router.get("/api/hoadon")
def api_hoadon():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT h.mahd AS MaHD, h.ngaytao AS NgayLap, 
                       COALESCE(h.tongthanhtoan, h.tongtien, 0) AS TongTien,
                       CASE WHEN h.trangthai = 'DaThanhToan' THEN 'Da thanh toan' ELSE 'Dang phuc vu' END AS TrangThai,
                       b.tenban AS TenBan, nv.hoten AS TenNV
                FROM hoadon h 
                LEFT JOIN banan b ON h.maban = b.maban 
                LEFT JOIN nhanvien nv ON h.manv = nv.manv 
                ORDER BY h.mahd DESC
            """))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}


@router.get("/api/chitiet/{ma_hd}")
def api_chitiet(ma_hd: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT ct.mahd AS MaHD, ct.mamon AS MaMon, ct.soluong AS SoLuong, ct.dongia AS DonGia,
                       COALESCE(ct.thanhtien, ct.soluong * ct.dongia) AS ThanhTien, m.tenmon AS TenMon 
                FROM ct_hoadon ct 
                LEFT JOIN monan m ON ct.mamon = m.mamon 
                WHERE ct.mahd = :id
            """), {"id": ma_hd})
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}