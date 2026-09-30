import pymysql
import json

try:
    conn = pymysql.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="nhahang",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )
    with conn.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        tables = [list(row.values())[0] for row in cursor.fetchall()]
        
        schema = {}
        for table in tables:
            cursor.execute(f"DESCRIBE `{table}`")
            columns = cursor.fetchall()
            cursor.execute(f"SELECT * FROM `{table}` LIMIT 3")
            sample_data = cursor.fetchall()
            schema[table] = {
                "columns": columns,
                "samples": sample_data
            }
            
        with open("nhahang_schema.json", "w", encoding="utf-8") as f:
            json.dump(schema, f, ensure_ascii=False, indent=2, default=str)
            
        print("[+] Đã quét xong toàn bộ cấu trúc database `nhahang` và lưu vào nhahang_schema.json!")
    conn.close()
except Exception as e:
    print(f"[-] Lỗi: {e}")
