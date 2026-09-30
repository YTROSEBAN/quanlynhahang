import os
import pymysql
from sqlalchemy import create_engine, text

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_NAME = "quanlynhahang"

def setup_database():
    print(f"[*] Đang kết nối tới MySQL ({MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT})...")
    
    # 1. Kết nối không cần chọn database để tạo database nếu chưa có
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            charset="utf8mb4"
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"[+] Đã tạo / kiểm tra database `{DB_NAME}` thành công.")
        conn.close()
    except Exception as e:
        print(f"[-] Lỗi kết nối MySQL: {e}")
        print("    -> Vui lòng đảm bảo MySQL (XAMPP / Laragon / MySQL Service) đang chạy!")
        return False

    # 2. Đọc file SQL và thực thi
    sql_file = os.path.join(os.path.dirname(__file__), "database", "init_db.sql")
    if not os.path.exists(sql_file):
        print(f"[-] Không tìm thấy file {sql_file}")
        return False

    print(f"[*] Đang khởi tạo các bảng và dữ liệu mẫu từ {sql_file}...")
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=DB_NAME,
            charset="utf8mb4",
            client_flag=pymysql.constants.CLIENT.MULTI_STATEMENTS
        )
        with open(sql_file, "r", encoding="utf-8") as f:
            sql_script = f.read()

        with conn.cursor() as cursor:
            cursor.execute(sql_script)
        conn.commit()
        conn.close()
        print("[+] Khởi tạo database và dữ liệu mẫu thành công 100%!")
        print("    - Danh mục & Món ăn")
        print("    - Bàn & Trạng thái")
        print("    - Nhân viên & Khách hàng")
        print("    - Hóa đơn & Chi tiết hóa đơn mẫu")
        return True
    except Exception as e:
        print(f"[-] Lỗi khi thực thi script SQL: {e}")
        return False

if __name__ == "__main__":
    setup_database()
