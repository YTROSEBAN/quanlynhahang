-- ======================================================
-- CƠ SỞ DỮ LIỆU: QUẢN LÝ NHÀ HÀNG
-- ======================================================

CREATE DATABASE IF NOT EXISTS `quanlynhahang` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `quanlynhahang`;

-- 1. Bảng Danh mục món ăn
DROP TABLE IF EXISTS `chitiethoadon`;
DROP TABLE IF EXISTS `hoadon`;
DROP TABLE IF EXISTS `datban`;
DROP TABLE IF EXISTS `monan`;
DROP TABLE IF EXISTS `danhmuc`;
DROP TABLE IF EXISTS `ban`;
DROP TABLE IF EXISTS `nhanvien`;
DROP TABLE IF EXISTS `khachhang`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `menu`;

CREATE TABLE `danhmuc` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ten_danhmuc` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Món ăn
CREATE TABLE `monan` (
    `MaMon` INT AUTO_INCREMENT PRIMARY KEY,
    `TenMon` VARCHAR(255) NOT NULL,
    `DonGia` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `DonViTinh` VARCHAR(50) DEFAULT 'Phần',
    `HinhAnh` VARCHAR(255) DEFAULT '',
    `MoTa` TEXT,
    `MaDM` INT NULL,
    `TrangThai` VARCHAR(50) DEFAULT 'Con ban',
    CONSTRAINT `fk_monan_danhmuc` FOREIGN KEY (`MaDM`) REFERENCES `danhmuc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Bàn ăn
CREATE TABLE `ban` (
    `MaBan` INT AUTO_INCREMENT PRIMARY KEY,
    `TenBan` VARCHAR(100) NOT NULL,
    `KhuVuc` VARCHAR(50) DEFAULT 'A',
    `SucChua` INT DEFAULT 4,
    `TrangThai` VARCHAR(50) DEFAULT 'Trong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Nhân viên
CREATE TABLE `nhanvien` (
    `MaNV` INT AUTO_INCREMENT PRIMARY KEY,
    `HoTen` VARCHAR(255) NOT NULL,
    `GioiTinh` VARCHAR(10) DEFAULT 'Nam',
    `SDT` VARCHAR(20) DEFAULT '',
    `Email` VARCHAR(100) DEFAULT '',
    `DiaChi` VARCHAR(255) DEFAULT '',
    `ChucVu` VARCHAR(50) NOT NULL,
    `Username` VARCHAR(50) NOT NULL UNIQUE,
    `Password` VARCHAR(255) NOT NULL,
    `TrangThai` VARCHAR(50) DEFAULT 'Dang lam'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Khách hàng
CREATE TABLE `khachhang` (
    `MaKH` INT AUTO_INCREMENT PRIMARY KEY,
    `HoTen` VARCHAR(255) NOT NULL,
    `SDT` VARCHAR(20) DEFAULT '',
    `Email` VARCHAR(100) DEFAULT '',
    `DiaChi` VARCHAR(255) DEFAULT '',
    `NgayTao` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Đặt bàn
CREATE TABLE `datban` (
    `MaDatBan` INT AUTO_INCREMENT PRIMARY KEY,
    `MaBan` INT NOT NULL,
    `MaKH` INT NULL,
    `NgayDat` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `SoNguoi` INT DEFAULT 2,
    `GhiChu` TEXT,
    `TrangThai` VARCHAR(50) DEFAULT 'Da dat',
    CONSTRAINT `fk_datban_ban` FOREIGN KEY (`MaBan`) REFERENCES `ban`(`MaBan`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_datban_khachhang` FOREIGN KEY (`MaKH`) REFERENCES `khachhang`(`MaKH`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Hóa đơn
CREATE TABLE `hoadon` (
    `MaHD` INT AUTO_INCREMENT PRIMARY KEY,
    `MaNV` INT NULL,
    `MaBan` INT NULL,
    `MaKH` INT NULL,
    `NgayLap` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `TongTien` DECIMAL(12,2) DEFAULT 0,
    `GiamGia` DECIMAL(12,2) DEFAULT 0,
    `ThanhTien` DECIMAL(12,2) DEFAULT 0,
    `TrangThai` VARCHAR(50) DEFAULT 'Dang phuc vu',
    CONSTRAINT `fk_hoadon_nhanvien` FOREIGN KEY (`MaNV`) REFERENCES `nhanvien`(`MaNV`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_hoadon_ban` FOREIGN KEY (`MaBan`) REFERENCES `ban`(`MaBan`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_hoadon_khachhang` FOREIGN KEY (`MaKH`) REFERENCES `khachhang`(`MaKH`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Chi tiết hóa đơn
CREATE TABLE `chitiethoadon` (
    `MaCTHD` INT AUTO_INCREMENT PRIMARY KEY,
    `MaHD` INT NOT NULL,
    `MaMon` INT NOT NULL,
    `SoLuong` INT NOT NULL DEFAULT 1,
    `DonGia` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `ThanhTien` DECIMAL(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT `fk_cthd_hoadon` FOREIGN KEY (`MaHD`) REFERENCES `hoadon`(`MaHD`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_cthd_monan` FOREIGN KEY (`MaMon`) REFERENCES `monan`(`MaMon`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng phụ trợ Menu & Orders (hỗ trợ router menu nếu dùng)
CREATE TABLE `menu` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL,
    `Price` INT NOT NULL,
    `Size` INT DEFAULT 1,
    `Image` VARCHAR(255) DEFAULT '',
    `Type` VARCHAR(100) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `menu_id` INT NOT NULL,
    `menu_name` VARCHAR(255) NOT NULL,
    `menu_price` INT NOT NULL,
    `menu_size` INT NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` TEXT NOT NULL,
    `quantity` INT DEFAULT 1,
    `status` VARCHAR(50) DEFAULT 'Chờ xử lý',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ======================================================

-- 1. Danh mục
INSERT INTO `danhmuc` (`id`, `ten_danhmuc`) VALUES
(1, 'Khai vị'),
(2, 'Món chính'),
(3, 'Lẩu & Nướng'),
(4, 'Hải sản'),
(5, 'Đồ uống'),
(6, 'Tráng miệng');

-- 2. Món ăn
INSERT INTO `monan` (`MaMon`, `TenMon`, `DonGia`, `DonViTinh`, `HinhAnh`, `MoTa`, `MaDM`, `TrangThai`) VALUES
(1, 'Gỏi ngó sen tôm thịt', 85000, 'Đĩa', '', 'Ngó sen giòn ngọt trộn tôm sú và thịt ba chỉ tươi ngon', 1, 'Con ban'),
(2, 'Khoai tây chiên bơ tỏi', 45000, 'Đĩa', '', 'Khoai tây chiên vàng giòn thơm lừng hương bơ tỏi', 1, 'Con ban'),
(3, 'Bò lúc lắc khoai tây', 145000, 'Đĩa', '', 'Thịt bò mềm đậm đà kèm khoai chiên và sốt tiêu', 2, 'Con ban'),
(4, 'Gà hấp lá chanh', 160000, 'Nửa con', '', 'Gà ta thả vườn thịt chắc, ngọt thơm hương lá chanh', 2, 'Con ban'),
(5, 'Sườn non nướng BBQ', 180000, 'Phần', '', 'Sườn non tẩm ướp sốt BBQ đậm đà nướng than hoa', 3, 'Con ban'),
(6, 'Lẩu hải sản chua cay', 290000, 'Nồi', '', 'Nồi lẩu tôm, mực, nghêu, cá hồi kèm rau tươi nước dùng Tomyum', 3, 'Con ban'),
(7, 'Tôm sú hấp bia', 220000, 'Đĩa', '', 'Tôm sú loại 1 hấp cùng bia tươi ngọt thịt', 4, 'Con ban'),
(8, 'Mực trứng chiên nước mắm', 175000, 'Đĩa', '', 'Mực trứng ôm trứng béo ngậy rim nước mắm tỏi ớt', 4, 'Con ban'),
(9, 'Bia Tiger lon', 25000, 'Lon', '', 'Bia Tiger bạc mát lạnh', 5, 'Con ban'),
(10, 'Trà đào cam sả', 35000, 'Ly', '', 'Trà đào thanh mát với đào miếng giòn thơm sả tươi', 5, 'Con ban'),
(11, 'Nước suối Aquafina', 15000, 'Chai', '', 'Nước khoáng tinh khiết 500ml', 5, 'Con ban'),
(12, 'Chè khúc bạch hạnh nhân', 35000, 'Bát', '', 'Chè khúc bạch mát lành, hạt hạnh nhân rang giòn', 6, 'Con ban');

-- 3. Bàn ăn
INSERT INTO `ban` (`MaBan`, `TenBan`, `KhuVuc`, `SucChua`, `TrangThai`) VALUES
(1, 'Bàn A-01', 'A', 4, 'Trong'),
(2, 'Bàn A-02', 'A', 4, 'Da dat'),
(3, 'Bàn A-03', 'A', 6, 'Trong'),
(4, 'Bàn B-01', 'B', 4, 'Dang su dung'),
(5, 'Bàn B-02', 'B', 8, 'Trong'),
(6, 'Bàn B-03', 'B', 10, 'Trong'),
(7, 'Bàn VIP-01', 'C', 12, 'Trong'),
(8, 'Bàn VIP-02', 'C', 16, 'Trong');

-- 4. Nhân viên
INSERT INTO `nhanvien` (`MaNV`, `HoTen`, `GioiTinh`, `SDT`, `Email`, `DiaChi`, `ChucVu`, `Username`, `Password`, `TrangThai`) VALUES
(1, 'Nguyễn Văn Quản Lý', 'Nam', '0901234567', 'admin@nhahang.com', '123 Lê Duẩn, Đà Nẵng', 'Quản lý', 'admin', '123456', 'Dang lam'),
(2, 'Trần Thị Thu Ngân', 'Nữ', '0912345678', 'thungan@nhahang.com', '45 Hùng Vương, Đà Nẵng', 'Thu ngân', 'thungan', '123456', 'Dang lam'),
(3, 'Lê Văn Phục Vụ', 'Nam', '0923456789', 'phucvu@nhahang.com', '78 Nguyễn Huệ, Đà Nẵng', 'Phục vụ', 'phucvu', '123456', 'Dang lam');

-- 5. Khách hàng
INSERT INTO `khachhang` (`MaKH`, `HoTen`, `SDT`, `Email`, `DiaChi`, `NgayTao`) VALUES
(1, 'Phạm Hoàng Nam', '0934567890', 'nam.pham@gmail.com', 'Đà Nẵng', NOW()),
(2, 'Vũ Thị Mai', '0945678901', 'mai.vu@gmail.com', 'Quảng Nam', NOW()),
(3, 'Ngô Quốc Anh', '0956789012', 'anh.ngo@gmail.com', 'Huế', NOW());

-- 6. Đặt bàn
INSERT INTO `datban` (`MaDatBan`, `MaBan`, `MaKH`, `NgayDat`, `SoNguoi`, `GhiChu`, `TrangThai`) VALUES
(1, 2, 1, DATE_ADD(NOW(), INTERVAL 2 HOUR), 4, 'Bàn gần cửa sổ mát mẻ', 'Da dat'),
(2, 4, 2, NOW(), 4, 'Khách đến đúng giờ', 'Dang su dung');

-- 7. Hóa đơn mẫu
INSERT INTO `hoadon` (`MaHD`, `MaNV`, `MaBan`, `MaKH`, `NgayLap`, `TongTien`, `GiamGia`, `ThanhTien`, `TrangThai`) VALUES
(1, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 420000, 0, 420000, 'Da thanh toan'),
(2, 2, 4, 2, NOW(), 505000, 0, 505000, 'Dang phuc vu');

-- 8. Chi tiết hóa đơn
INSERT INTO `chitiethoadon` (`MaHD`, `MaMon`, `SoLuong`, `DonGia`, `ThanhTien`) VALUES
-- HĐ 1
(1, 1, 1, 85000, 85000),
(1, 3, 2, 145000, 290000),
(1, 9, 2, 25000, 50000),
-- HĐ 2
(2, 6, 1, 290000, 290000),
(2, 5, 1, 180000, 180000),
(2, 10, 1, 35000, 35000);
