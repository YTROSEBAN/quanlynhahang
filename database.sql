-- =============================================
-- DATABASE NHÀ HÀNG
-- Tên cột dùng PascalCase để khớp với truy cập
-- thuộc tính hàng trong Python (vd: mon.DonGia, hd.MaHD)
-- và các template Jinja2.
-- =============================================
CREATE DATABASE IF NOT EXISTS nhahang
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nhahang;

-- =============================================
-- 1. BẢNG CHỨC VỤ
-- =============================================
CREATE TABLE chucvu (
  MaCV        INT AUTO_INCREMENT PRIMARY KEY,
  TenCV       VARCHAR(100) NOT NULL,
  MoTa        VARCHAR(255),
  LuongCoBan  DECIMAL(12,2) DEFAULT 0
);

-- =============================================
-- 2. BẢNG TÀI KHOẢN
-- =============================================
CREATE TABLE taikhoan (
  MaTK         INT AUTO_INCREMENT PRIMARY KEY,
  TenDangNhap  VARCHAR(50) NOT NULL UNIQUE,
  MatKhau      VARCHAR(255) NOT NULL,
  TrangThai    VARCHAR(30) DEFAULT 'Dang lam',
  MaNV         INT
);

-- =============================================
-- 3. BẢNG NHÂN VIÊN
-- =============================================
CREATE TABLE nhanvien (
  MaNV         INT AUTO_INCREMENT PRIMARY KEY,
  HoTen        VARCHAR(100) NOT NULL,
  NgaySinh     DATE,
  GioiTinh     VARCHAR(10) DEFAULT 'Nam',
  SoDienThoai  VARCHAR(15),
  SDT          VARCHAR(15),
  DiaChi       VARCHAR(255),
  Email        VARCHAR(100),
  NgayVaoLam   DATE,
  MaCV         INT,
  ChucVu       VARCHAR(100),
  Username     VARCHAR(50) UNIQUE,
  Password     VARCHAR(255),
  TrangThai    VARCHAR(30) DEFAULT 'Dang lam',
  CONSTRAINT fk_nv_cv FOREIGN KEY (MaCV) REFERENCES chucvu(MaCV)
);

ALTER TABLE taikhoan
  ADD CONSTRAINT fk_tk_nv FOREIGN KEY (MaNV) REFERENCES nhanvien(MaNV);

-- =============================================
-- 4. BẢNG KHÁCH HÀNG
-- =============================================
CREATE TABLE khachhang (
  MaKH         INT AUTO_INCREMENT PRIMARY KEY,
  HoTen        VARCHAR(100) NOT NULL,
  SoDienThoai  VARCHAR(15),
  SDT          VARCHAR(15),
  Email        VARCHAR(100),
  DiaChi       VARCHAR(255),
  NgayDangKy   DATE DEFAULT (CURRENT_DATE),
  DiemTichLuy  INT DEFAULT 0
);

-- =============================================
-- 5. BẢNG BÀN ĂN
-- =============================================
CREATE TABLE ban (
  MaBan        INT AUTO_INCREMENT PRIMARY KEY,
  TenBan       VARCHAR(50) NOT NULL,
  KhuVuc       VARCHAR(50) DEFAULT 'A',
  SucChua      INT DEFAULT 4,
  TrangThai    VARCHAR(30) DEFAULT 'Trong'
);

-- =============================================
-- 6. BẢNG DANH MỤC MÓN
-- =============================================
CREATE TABLE danhmuc (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  ten_danhmuc  VARCHAR(100) NOT NULL,
  MoTa         VARCHAR(255)
);

-- =============================================
-- 7. BẢNG MÓN ĂN
-- =============================================
CREATE TABLE monan (
  MaMon        INT AUTO_INCREMENT PRIMARY KEY,
  TenMon       VARCHAR(150) NOT NULL,
  MaDM         INT,
  DonGia       DECIMAL(12,2) NOT NULL,
  DonViTinh    VARCHAR(20) DEFAULT 'Phan',
  MoTa         VARCHAR(255),
  HinhAnh      VARCHAR(255),
  TrangThai    VARCHAR(30) DEFAULT 'Con ban',
  CONSTRAINT fk_ma_dm FOREIGN KEY (MaDM) REFERENCES danhmuc(id)
);

-- =============================================
-- 8. BẢNG NGUYÊN LIỆU
-- =============================================
CREATE TABLE nguyenlieu (
  MaNL         INT AUTO_INCREMENT PRIMARY KEY,
  TenNL        VARCHAR(150) NOT NULL,
  DVT          VARCHAR(20),
  SoLuongTon   DECIMAL(12,2) DEFAULT 0,
  GiaBan       DECIMAL(12,2) DEFAULT 0,
  HanSuDung    DATE
);

-- =============================================
-- 9. BẢNG NHÀ CUNG CẤP
-- =============================================
CREATE TABLE nhacungcap (
  MaNCC        INT AUTO_INCREMENT PRIMARY KEY,
  TenNCC       VARCHAR(150) NOT NULL,
  SDT          VARCHAR(15),
  Email        VARCHAR(100),
  DiaChi       VARCHAR(255)
);

-- =============================================
-- 10. PHIẾU NHẬP
-- =============================================
CREATE TABLE phieunhap (
  MaPN         INT AUTO_INCREMENT PRIMARY KEY,
  MaNCC        INT,
  NgayNhap     DATE DEFAULT (CURRENT_DATE),
  TongTien     DECIMAL(12,2) DEFAULT 0,
  CONSTRAINT fk_pn_ncc FOREIGN KEY (MaNCC) REFERENCES nhacungcap(MaNCC)
);

CREATE TABLE ct_phieunhap (
  MaPN         INT,
  MaNL         INT,
  SoLuong      INT NOT NULL,
  DonGia       DECIMAL(12,2) NOT NULL,
  ThanhTien    DECIMAL(12,2) DEFAULT 0,
  PRIMARY KEY (MaPN, MaNL),
  CONSTRAINT fk_ctpn_pn FOREIGN KEY (MaPN) REFERENCES phieunhap(MaPN),
  CONSTRAINT fk_ctpn_nl FOREIGN KEY (MaNL) REFERENCES nguyenlieu(MaNL)
);

-- =============================================
-- 11. ĐẶT BÀN
-- =============================================
CREATE TABLE datban (
  MaDatBan     INT AUTO_INCREMENT PRIMARY KEY,
  MaKH         INT,
  MaBan        INT,
  NgayDat      DATE NOT NULL,
  GioDat       TIME,
  SoNguoi      INT DEFAULT 1,
  GhiChu       VARCHAR(255),
  TrangThai    VARCHAR(30) DEFAULT 'Cho',
  CONSTRAINT fk_db_kh FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH),
  CONSTRAINT fk_db_ban FOREIGN KEY (MaBan) REFERENCES ban(MaBan)
);

-- =============================================
-- 12. HÓA ĐƠN
-- =============================================
CREATE TABLE hoadon (
  MaHD         INT AUTO_INCREMENT PRIMARY KEY,
  MaKH         INT,
  MaBan        INT,
  MaNV         INT,
  NgayLap      DATETIME DEFAULT CURRENT_TIMESTAMP,
  TongTien     DECIMAL(12,2) DEFAULT 0,
  GiamGia      DECIMAL(12,2) DEFAULT 0,
  ThanhTien    DECIMAL(12,2) DEFAULT 0,
  TrangThai    VARCHAR(30) DEFAULT 'Dang phuc vu',
  CONSTRAINT fk_hd_kh FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH),
  CONSTRAINT fk_hd_ban FOREIGN KEY (MaBan) REFERENCES ban(MaBan),
  CONSTRAINT fk_hd_nv FOREIGN KEY (MaNV) REFERENCES nhanvien(MaNV)
);

-- =============================================
-- 13. CHI TIẾT HÓA ĐƠN
-- =============================================
CREATE TABLE chitiethoadon (
  MaHD         INT,
  MaMon        INT,
  SoLuong      INT NOT NULL,
  DonGia       DECIMAL(12,2) NOT NULL,
  ThanhTien    DECIMAL(12,2) DEFAULT 0,
  PRIMARY KEY (MaHD, MaMon),
  CONSTRAINT fk_cthd_hd FOREIGN KEY (MaHD) REFERENCES hoadon(MaHD),
  CONSTRAINT fk_cthd_mon FOREIGN KEY (MaMon) REFERENCES monan(MaMon)
);

-- =============================================
-- 14. KHUYẾN MÃI
-- =============================================
CREATE TABLE khuyenmai (
  MaKM         INT AUTO_INCREMENT PRIMARY KEY,
  TenKM        VARCHAR(100) NOT NULL,
  GiamGia      DECIMAL(12,2) DEFAULT 0,
  NgayBatDau   DATE,
  NgayKetThuc  DATE,
  DKKhac       VARCHAR(255),
  TrangThai    VARCHAR(30) DEFAULT 'Dang lam'
);

-- =============================================
-- 15. THANH TOÁN
-- =============================================
CREATE TABLE thanhtoan (
  MaTT         INT AUTO_INCREMENT PRIMARY KEY,
  MaHD         INT,
  NgayThanhToan DATETIME DEFAULT CURRENT_TIMESTAMP,
  PhuongThucTT VARCHAR(30) DEFAULT 'TienMat',
  SoTien       DECIMAL(12,2) NOT NULL,
  MaKM         INT,
  GhiChu       VARCHAR(255),
  CONSTRAINT fk_tt_hd FOREIGN KEY (MaHD) REFERENCES hoadon(MaHD),
  CONSTRAINT fk_tt_km FOREIGN KEY (MaKM) REFERENCES khuyenmai(MaKM)
);

-- =============================================
-- 16. Dữ liệu mẫu tối thiểu
-- =============================================
INSERT INTO danhmuc (ten_danhmuc, MoTa) VALUES
  ('Mon chinh', 'Cac mon chinh'),
  ('Nuoc', 'Do uong');

INSERT INTO monan (TenMon, MaDM, DonGia, DonViTinh, MoTa, TrangThai) VALUES
  ('Pho bo Hue', 1, 55000, 'Phan', 'Pho bo Huong', 'Con ban'),
  ('Bo cuon tom thit', 1, 75000, 'Phan', 'Bo cuon', 'Con ban'),
  ('Cha gio hai san', 1, 35000, 'Phan', 'Cha gio', 'Con ban'),
  ('Nuoc cam ep', 2, 25000, 'Ly', 'Nuoc cam', 'Con ban'),
  ('Bun bo Hue', 2, 45000, 'Phan', 'Bun bo Hue', 'Con ban'),
  ('Goi cuon tom thit', 1, 85000, 'Phan', 'Goi cuon', 'Con ban');

INSERT INTO nhanvien (HoTen, GioiTinh, SDT, Email, DiaChi, ChucVu, Username, Password, TrangThai) VALUES
  ('Nguyen Van A', 'Nam', '0901000001', 'a@quanlynhahang.vn', 'Quan 1, TP.HCM', 'Thu nguyen', 'admin', '123456', 'Dang lam'),
  ('Tran Thi B', 'Nu', '0901000002', 'b@quanlynhahang.vn', 'Quan 3, TP.HCM', 'Phuc vu', 'phucvu', '123456', 'Dang lam');

INSERT INTO ban (TenBan, KhuVuc, SucChua, TrangThai) VALUES
  ('B01', 'A', 4, 'Trong'),
  ('B02', 'A', 4, 'Trong'),
  ('B03', 'B', 6, 'Trong'),
  ('B04', 'B', 6, 'Trong'),
  ('B05', 'C', 8, 'Trong'),
  ('B06', 'C', 8, 'Trong');

INSERT INTO khachhang (HoTen, SDT, Email, DiaChi) VALUES
  ('Le Van C', '0912000001', 'c@example.com', 'Quan 5, TP.HCM'),
  ('Pham Thi D', '0912000002', 'd@example.com', 'Binh Thanh, TP.HCM');
