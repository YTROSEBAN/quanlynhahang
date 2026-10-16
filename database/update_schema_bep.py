import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import engine, text

def update_kitchen_schema():
    with engine.begin() as conn:
        cols = [r[0] for r in conn.execute(text("DESCRIBE ct_hoadon")).fetchall()]
        if "trangthai" not in cols:
            conn.execute(text("ALTER TABLE ct_hoadon ADD COLUMN trangthai VARCHAR(50) DEFAULT 'ChoNau'"))
            print("Added trangthai column to ct_hoadon")
        if "thoigian_order" not in cols:
            conn.execute(text("ALTER TABLE ct_hoadon ADD COLUMN thoigian_order DATETIME DEFAULT CURRENT_TIMESTAMP"))
            print("Added thoigian_order column to ct_hoadon")
        if "ghichu" not in cols:
            conn.execute(text("ALTER TABLE ct_hoadon ADD COLUMN ghichu VARCHAR(255) DEFAULT ''"))
            print("Added ghichu column to ct_hoadon")
        
        # Cập nhật các món cũ chưa có trạng thái sang ChoNau
        conn.execute(text("UPDATE ct_hoadon SET trangthai = 'ChoNau' WHERE trangthai IS NULL OR trangthai = ''"))
        print("Schema update completed successfully!")

if __name__ == "__main__":
    update_kitchen_schema()
