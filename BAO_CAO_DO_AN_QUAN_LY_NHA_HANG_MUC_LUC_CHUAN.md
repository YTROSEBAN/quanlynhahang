# BÁO CÁO ĐỒ ÁN KẾT THÚC MÔN HỌC
## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG PHẦN MỀM QUẢN LÝ NHÀ HÀNG (RMS)

**File Word nộp bài:** [BAO_CAO_DO_AN_QUAN_LY_NHA_HANG_MUC_LUC_CHUAN.doc](file:///d:/qlnhahang/BAO_CAO_DO_AN_QUAN_LY_NHA_HANG_MUC_LUC_CHUAN.doc)

---

# MỤC LỤC

**CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ NGHIÊN CỨU HIỆN TRẠNG** .................................... 1  
&nbsp;&nbsp;&nbsp;&nbsp;1.1. &nbsp;Đặt vấn đề và tính cấp thiết của đề tài .......................................................................... 1  
&nbsp;&nbsp;&nbsp;&nbsp;1.2. &nbsp;Khảo sát thực trạng quy trình vận hành nhà hàng F&B ................................................. 2  
&nbsp;&nbsp;&nbsp;&nbsp;1.3. &nbsp;Mục tiêu và nhiệm vụ nghiên cứu của đồ án .................................................................. 3  
&nbsp;&nbsp;&nbsp;&nbsp;1.4. &nbsp;Đối tượng và phạm vi nghiên cứu .................................................................................. 3  
&nbsp;&nbsp;&nbsp;&nbsp;1.5. &nbsp;Bố cục tổng quan của báo cáo đồ án ............................................................................. 4  
**CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ NỀN TẢNG CÔNG NGHỆ** .................................... 5  
&nbsp;&nbsp;&nbsp;&nbsp;2.1. &nbsp;Kiến trúc ứng dụng Web 3 tầng (3-Tier Architecture) ..................................................... 5  
&nbsp;&nbsp;&nbsp;&nbsp;2.2. &nbsp;Công nghệ Client-side: React 19, Hooks, Vite Bundler ................................................... 6  
&nbsp;&nbsp;&nbsp;&nbsp;2.3. &nbsp;Công nghệ Server-side: Node.js và Express RESTful API .............................................. 7  
&nbsp;&nbsp;&nbsp;&nbsp;2.4. &nbsp;Hệ quản trị cơ sở dữ liệu MySQL và Connection Pooling .............................................. 8  
**CHƯƠNG 3: PHÂN TÍCH YÊU CẦU NGHIỆP VỤ HỆ THỐNG** .................................... 9  
&nbsp;&nbsp;&nbsp;&nbsp;3.1. &nbsp;Danh mục 9 yêu cầu chức năng cốt lõi (F1 – F9) ............................................................ 9  
&nbsp;&nbsp;&nbsp;&nbsp;3.2. &nbsp;Các yêu cầu phi chức năng (Non-Functional Requirements) .......................................... 11  
&nbsp;&nbsp;&nbsp;&nbsp;3.3. &nbsp;Phân tích tác nhân (Actors) và ma trận phân quyền (RBAC) ........................................... 12  
&nbsp;&nbsp;&nbsp;&nbsp;3.4. &nbsp;Đặc tả các Use Case trọng tâm (Đăng nhập, Gọi món, Bếp KDS) .................................. 13  
**CHƯƠNG 4: THIẾT KẾ HỆ THỐNG VÀ CƠ SỞ DỮ LIỆU** ........................................... 15  
&nbsp;&nbsp;&nbsp;&nbsp;4.1. &nbsp;Sơ đồ kiến trúc tổng thể và luồng tương tác dữ liệu ......................................................... 15  
&nbsp;&nbsp;&nbsp;&nbsp;4.2. &nbsp;Thiết kế sơ đồ thực thể liên kết (ERD) ............................................................................. 16  
&nbsp;&nbsp;&nbsp;&nbsp;4.3. &nbsp;Từ điển dữ liệu chi tiết của 16 bảng MySQL ..................................................................... 17  
&nbsp;&nbsp;&nbsp;&nbsp;4.4. &nbsp;Thiết kế chi tiết các RESTful API Endpoints ..................................................................... 21  
**CHƯƠNG 5: HIỆN THỰC VÀ ĐÁNH GIÁ KẾT QUẢ ĐỀ TÀI** .................................... 23  
&nbsp;&nbsp;&nbsp;&nbsp;5.1. &nbsp;Môi trường triển khai và cấu hình phần mềm .................................................................... 23  
&nbsp;&nbsp;&nbsp;&nbsp;5.2. &nbsp;Hiện thực giao diện các phân hệ chính (POS, KDS, Kho, CRM) ....................................... 24  
&nbsp;&nbsp;&nbsp;&nbsp;5.3. &nbsp;Hiện thực quy chuẩn ràng buộc dữ liệu (SĐT 10–11 số, Email) ........................................ 26  
&nbsp;&nbsp;&nbsp;&nbsp;5.4. &nbsp;Kịch bản kiểm thử nghiệm thu (Test Cases TC01 – TC08) ................................................ 27  
&nbsp;&nbsp;&nbsp;&nbsp;5.5. &nbsp;Số liệu thống kê thực nghiệm trên Database MySQL ........................................................ 29  
**CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN** .................................................... 30  
&nbsp;&nbsp;&nbsp;&nbsp;6.1. &nbsp;Đánh giá kết quả đạt được so với mục tiêu ........................................................................ 30  
&nbsp;&nbsp;&nbsp;&nbsp;6.2. &nbsp;Những điểm còn hạn chế của đề tài ................................................................................... 31  
&nbsp;&nbsp;&nbsp;&nbsp;6.3. &nbsp;Đề xuất hướng phát triển mở rộng trong tương lai ............................................................. 31  
**CHƯƠNG 7: HÌNH ẢNH MINH HỌA** ............................................................................. 33  
&nbsp;&nbsp;&nbsp;&nbsp;7.1. &nbsp;Một số hình ảnh giao diện hệ thống .................................................................................. 33  
&nbsp;&nbsp;&nbsp;&nbsp;7.2. &nbsp;Sơ đồ kiến trúc và cơ sở dữ liệu ......................................................................................... 35  
&nbsp;&nbsp;&nbsp;&nbsp;7.3. &nbsp;Hình ảnh minh họa quá trình vận hành ............................................................................. 37  
**TÀI LIỆU THAM KHẢO VÀ PHỤ LỤC TÀI KHOẢN KHẢO SÁT** ............................... 39  
