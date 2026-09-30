from sqlalchemy import text

def run_seed(engine):
    with engine.connect() as conn:
        # 1. Danh mục món ăn
        cnt_dm = conn.execute(text("SELECT COUNT(*) FROM danhmuc")).scalar()
        if cnt_dm < 4:
            conn.execute(text("""
                INSERT INTO danhmuc (tendm, mota) VALUES
                ('Khai vị', 'Các món nhẹ nhàng đánh thức vị giác'),
                ('Món chính', 'Đặc sản ẩm thực Việt Nam & Á Âu'),
                ('Lẩu & Nướng', 'Hương vị đậm đà, tươi nóng tại bàn'),
                ('Hải sản tươi sống', 'Tôm, cua, mực, cá tươi chế biến trong ngày'),
                ('Tráng miệng', 'Chè, kem, trái cây tươi nhiệt đới'),
                ('Đồ uống & Rượu', 'Nước ép, bia, cocktail và rượu vang cao cấp')
            """))
            conn.commit()

        # 2. Bàn ăn
        cnt_ban = conn.execute(text("SELECT COUNT(*) FROM banan")).scalar()
        if cnt_ban < 6:
            conn.execute(text("""
                INSERT INTO banan (tenban, vitri, sachogoi, trangthai) VALUES
                ('Bàn A-01', 'Tầng 1 (Khu A)', 4, 'Trong'),
                ('Bàn A-02', 'Tầng 1 (Khu A)', 4, 'DaDat'),
                ('Bàn A-03', 'Tầng 1 (Khu A)', 6, 'DangSuDung'),
                ('Bàn B-01', 'Sân Vườn Thoáng Mát', 6, 'Trong'),
                ('Bàn B-02', 'Sân Vườn Thoáng Mát', 8, 'Trong'),
                ('Bàn B-03', 'Sân Vườn Thoáng Mát', 10, 'DangSuDung'),
                ('VIP Room 1', 'Tầng Lửng VIP', 12, 'Trong'),
                ('VIP Room 2', 'Tầng Lửng VIP', 16, 'DaDat')
            """))
            conn.commit()

        # 3. Món ăn
        cnt_mon = conn.execute(text("SELECT COUNT(*) FROM monan")).scalar()
        if cnt_mon < 8:
            dm_rows = conn.execute(text("SELECT madm, tendm FROM danhmuc")).fetchall()
            dm_map = {row.tendm: row.madm for row in dm_rows}
            default_dm = dm_rows[0].madm if dm_rows else 1

            dishes = [
                ('Gỏi ngó sen tôm thịt', 'Khai vị', 85000, 'Ngó sen giòn ngọt trộn tôm sú và thịt ba chỉ tươi ngon', 1),
                ('Khoai tây chiên bơ tỏi', 'Khai vị', 45000, 'Khoai tây giòn rụm sốt bơ tỏi thơm ngậy', 1),
                ('Salad ức gà sốt mè rang', 'Khai vị', 75000, 'Rau xanh giòn mát, ức gà áp chảo sốt mè béo bùi', 1),
                ('Bò lúc lắc khoai tây', 'Món chính', 155000, 'Thịt bò thăn mềm ngọt xào ớt chuông sốt tiêu đen', 1),
                ('Gà ta hấp lá chanh', 'Món chính', 165000, 'Gà thả vườn da giòn thịt ngọt thơm lá chanh', 1),
                ('Sườn non nướng tảng BBQ', 'Món chính', 195000, 'Sườn non tẩm ướp đậm đà nướng than hoa', 1),
                ('Cá chẽm sốt chanh leo', 'Món chính', 185000, 'Phi lê cá chẽm giòn rụm đẫm sốt chanh leo chua ngọt', 1),
                ('Lẩu Thái hải sản Tomyum', 'Lẩu & Nướng', 299000, 'Nước lẩu chua cay đậm đà kèm tôm, mực, bò Mỹ', 1),
                ('Lẩu riêu cua bắp bò', 'Lẩu & Nướng', 320000, 'Riêu cua đồng thơm ngọt cùng thịt bắp bò hoa giòn sần sật', 1),
                ('Tôm sú hấp nước dừa', 'Hải sản tươi sống', 220000, 'Tôm sú loại 1 hấp nước dừa xiêm ngọt thanh', 1),
                ('Mực trứng chiên mắm', 'Hải sản tươi sống', 175000, 'Mực trứng ôm đầy trứng chiên nước mắm tỏi ớt', 1),
                ('Chè khúc bạch hạnh nhân', 'Tráng miệng', 35000, 'Khúc bạch phô mai béo ngậy kèm hạnh nhân sấy giòn', 1),
                ('Panna Cotta dâu tây', 'Tráng miệng', 40000, 'Bánh mềm tan mịn màng sốt dâu tây tươi', 1),
                ('Trà đào cam sả hạt chia', 'Đồ uống & Rượu', 38000, 'Vị thanh ngọt dịu mát sảng khoái ngày hè', 1),
                ('Sinh tố bơ sầu riêng', 'Đồ uống & Rượu', 50000, 'Bơ sáp béo ngậy xay mịn thơm hương sầu riêng', 1),
                ('Bia Heineken lon cao', 'Đồ uống & Rượu', 28000, 'Bia Hà Lan mát lạnh thượng hạng', 1)
            ]
            for ten, dm_name, gia, mota, tt in dishes:
                madm = dm_map.get(dm_name, default_dm)
                conn.execute(
                    text("INSERT INTO monan (tenmon, madm, gia, mota, hinhanh, trangthai) VALUES (:ten, :madm, :gia, :mota, '', :tt)"),
                    {"ten": ten, "madm": madm, "gia": gia, "mota": mota, "tt": tt}
                )
            conn.commit()

        # 4. Chức vụ & Nhân viên
        cnt_cv = conn.execute(text("SELECT COUNT(*) FROM chucvu")).scalar()
        if cnt_cv < 3:
            conn.execute(text("""
                INSERT INTO chucvu (tencv, mota, luongcoban) VALUES
                ('Quản lý', 'Điều hành mọi hoạt động nhà hàng', 15000000),
                ('Thu ngân', 'Thanh toán và kiểm soát quỹ tiền mặt', 8000000),
                ('Phục vụ', 'Phục vụ bàn và hỗ trợ khách hàng', 6500000),
                ('Bếp trưởng', 'Chịu trách nhiệm món ăn và chất lượng', 18000000)
            """))
            conn.commit()

        cnt_nv = conn.execute(text("SELECT COUNT(*) FROM nhanvien")).scalar()
        if cnt_nv < 3:
            cv_rows = conn.execute(text("SELECT macv, tencv FROM chucvu")).fetchall()
            cv_map = {r.tencv: r.macv for r in cv_rows}
            default_cv = cv_rows[0].macv if cv_rows else 1

            staffs = [
                ('Trần Quốc Đạt', '1992-05-14', 'Nam', '0905123456', 'Hải Châu, Đà Nẵng', 'dat.tran@nhahang.com', cv_map.get('Quản lý', default_cv), 'admin', '123456'),
                ('Lê Thị Mai', '1998-08-20', 'Nu', '0914987654', 'Sơn Trà, Đà Nẵng', 'mai.le@nhahang.com', cv_map.get('Thu ngân', default_cv), 'thungan', '123456'),
                ('Nguyễn Văn Tuấn', '2001-11-03', 'Nam', '0935112233', 'Thanh Khê, Đà Nẵng', 'tuan.nguyen@nhahang.com', cv_map.get('Phục vụ', default_cv), 'tuan_nv', '123456'),
                ('Võ Đình Hùng', '1988-02-17', 'Nam', '0908889900', 'Cẩm Lệ, Đà Nẵng', 'hung.vo@nhahang.com', cv_map.get('Bếp trưởng', default_cv), 'hung_chef', '123456')
            ]
            for hoten, nsinh, gt, sdt, dc, email, macv, user, pwd in staffs:
                conn.execute(
                    text("INSERT INTO nhanvien (hoten, ngaysinh, gioitinh, sodienthoai, diachi, email, ngayvaolam, macv) VALUES (:hoten, :ns, :gt, :sdt, :dc, :em, CURDATE(), :macv)"),
                    {"hoten": hoten, "ns": nsinh, "gt": gt, "sdt": sdt, "dc": dc, "em": email, "macv": macv}
                )
                manv = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                conn.execute(
                    text("INSERT INTO taikhoan (tendangnhap, matkhau, trangthai, manv) VALUES (:u, :p, 1, :manv)"),
                    {"u": user, "p": pwd, "manv": manv}
                )
            conn.commit()

        # 5. Khách hàng
        cnt_kh = conn.execute(text("SELECT COUNT(*) FROM khachhang")).scalar()
        if cnt_kh < 3:
            conn.execute(text("""
                INSERT INTO khachhang (hoten, sodienthoai, email, diachi, ngaydangky, diemtichluy) VALUES
                ('Nguyễn Hoàng Long', '0905999888', 'long.nh@gmail.com', 'Q. Hải Châu, Đà Nẵng', CURDATE(), 250),
                ('Phạm Ngọc Lan', '0913555777', 'lan.pham@gmail.com', 'Q. Ngũ Hành Sơn, Đà Nẵng', CURDATE(), 420),
                ('Vũ Minh Trí', '0978123456', 'tri.vu@gmail.com', 'Q. Cẩm Lệ, Đà Nẵng', CURDATE(), 100),
                ('Đặng Thị Thảo', '0944668899', 'thao.dang@yahoo.com', 'Q. Sơn Trà, Đà Nẵng', CURDATE(), 600)
            """))
            conn.commit()

        # 6. Đặt bàn
        cnt_db = conn.execute(text("SELECT COUNT(*) FROM datban")).scalar()
        if cnt_db < 2:
            kh_first = conn.execute(text("SELECT makh FROM khachhang LIMIT 2")).fetchall()
            ban_rows = conn.execute(text("SELECT maban FROM banan LIMIT 3")).fetchall()
            if kh_first and ban_rows:
                k1 = kh_first[0].makh
                k2 = kh_first[1].makh if len(kh_first) > 1 else k1
                b1 = ban_rows[0].maban
                b2 = ban_rows[1].maban if len(ban_rows) > 1 else b1
                conn.execute(
                    text("INSERT INTO datban (makh, maban, ngaydat, giodat, songuoi, ghiChu, trangthai) VALUES (:k1, :b1, CURDATE(), '19:00:00', 4, 'Tiệc sinh nhật, cần chuẩn bị hoa nến', 'XacNhan')"),
                    {"k1": k1, "b1": b1}
                )
                conn.execute(
                    text("INSERT INTO datban (makh, maban, ngaydat, giodat, songuoi, ghiChu, trangthai) VALUES (:k2, :b2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:30:00', 8, 'Họp mặt gia đình, ngồi gần cửa sổ', 'Cho')"),
                    {"k2": k2, "b2": b2}
                )
                conn.commit()

        # 7. Khuyến mãi
        cnt_km = conn.execute(text("SELECT COUNT(*) FROM khuyenmai")).scalar()
        if cnt_km < 2:
            conn.execute(text("""
                INSERT INTO khuyenmai (tenkm, loaikm, giatri, ngaybatdau, ngayketthuc, dkkhac, trangthai) VALUES
                ('Ưu Đãi Khai Trương 10%', 'PhanTram', 10.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Áp dụng cho hóa đơn từ 300.000₫', 1),
                ('Voucher Tri Ân Khách VIP', 'TienMat', 50000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Áp dụng cho khách hàng thành viên có từ 200 điểm', 1),
                ('Tiệc Nướng Cuối Tuần 15%', 'PhanTram', 15.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'Áp dụng từ Thứ 6 đến Chủ Nhật', 1)
            """))
            conn.commit()

        # 8. Nhà cung cấp & Kho nguyên liệu
        cnt_ncc = conn.execute(text("SELECT COUNT(*) FROM nhacungcap")).scalar()
        if cnt_ncc < 2:
            conn.execute(text("""
                INSERT INTO nhacungcap (tenncc, sodienthoai, email, diachi, ghichu) VALUES
                ('Công ty Thực Phẩm Sạch Xanh Mart', '02363888999', 'xanh@mart.vn', 'KCN Hòa Khánh, Đà Nẵng', 'Cung cấp thịt bò, thịt gà, rau sạch đạt chuẩn VietGAP'),
                ('Hải Sản Tươi Sống Biển Đông', '0905333444', 'haisan@biendong.com', 'Cảng Cá Thọ Quang, Đà Nẵng', 'Cung cấp tôm, cua, mực, cá tươi giao hàng mỗi sáng sớm')
            """))
            conn.commit()

        cnt_nl = conn.execute(text("SELECT COUNT(*) FROM nguyenlieu")).scalar()
        if cnt_nl < 4:
            conn.execute(text("""
                INSERT INTO nguyenlieu (tennl, dvt, soluongton, giaban, hansudung) VALUES
                ('Thịt bắp bò hoa Mỹ', 'Kg', 25.50, 220000, DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
                ('Tôm sú tươi sống loại 1', 'Kg', 18.00, 310000, DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
                ('Mực trứng tươi cấp đông', 'Kg', 30.00, 180000, DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
                ('Ức gà ta phi lê', 'Kg', 40.00, 85000, DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
                ('Nấm kim châm & Nấm hương', 'Gói', 50.00, 15000, DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
                ('Khoai tây cọng Bỉ', 'Túi 2kg', 20.00, 95000, DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
                ('Bia Heineken thùng 24 lon', 'Thùng', 35.00, 420000, DATE_ADD(CURDATE(), INTERVAL 180 DAY))
            """))
            conn.commit()

        # 9. Hóa đơn mẫu & Chi tiết
        cnt_hd = conn.execute(text("SELECT COUNT(*) FROM hoadon")).scalar()
        if cnt_hd < 2:
            ban_first = conn.execute(text("SELECT maban FROM banan LIMIT 2")).fetchall()
            nv_first = conn.execute(text("SELECT manv FROM nhanvien LIMIT 1")).fetchone()
            kh_first = conn.execute(text("SELECT makh FROM khachhang LIMIT 1")).fetchone()
            mon_list = conn.execute(text("SELECT mamon, gia FROM monan LIMIT 4")).fetchall()

            if ban_first and nv_first and mon_list:
                maban1 = ban_first[0].maban
                manv = nv_first.manv
                makh = kh_first.makh if kh_first else None

                # HĐ 1: Đã thanh toán
                conn.execute(
                    text("INSERT INTO hoadon (makh, maban, manv, ngaytao, tongtien, giamgia, trangthai) VALUES (:kh, :b, :nv, DATE_SUB(NOW(), INTERVAL 2 HOUR), 485000, 0, 'DaThanhToan')"),
                    {"kh": makh, "b": maban1, "nv": manv}
                )
                hd1_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                conn.execute(
                    text("INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia) VALUES (:hd, :mon, :sl, :dg)"),
                    {"hd": hd1_id, "mon": mon_list[0].mamon, "sl": 1, "dg": mon_list[0].gia}
                )
                if len(mon_list) > 1:
                    conn.execute(
                        text("INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia) VALUES (:hd, :mon, :sl, :dg)"),
                        {"hd": hd1_id, "mon": mon_list[1].mamon, "sl": 2, "dg": mon_list[1].gia}
                    )

                # HĐ 2: Đang phục vụ
                maban2 = ban_first[1].maban if len(ban_first) > 1 else maban1
                conn.execute(
                    text("INSERT INTO hoadon (makh, maban, manv, ngaytao, tongtien, giamgia, trangthai) VALUES (:kh, :b, :nv, NOW(), 520000, 0, 'Cho')"),
                    {"kh": makh, "b": maban2, "nv": manv}
                )
                hd2_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                if len(mon_list) > 2:
                    conn.execute(
                        text("INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia) VALUES (:hd, :mon, :sl, :dg)"),
                        {"hd": hd2_id, "mon": mon_list[2].mamon, "sl": 1, "dg": mon_list[2].gia}
                    )
                conn.commit()
