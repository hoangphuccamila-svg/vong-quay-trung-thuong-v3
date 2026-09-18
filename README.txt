VÒNG QUAY TRÚNG THƯỞNG V3
==========================

V3 gồm:
1. Trang người chơi: public/index.html
2. Trang quản trị: public/admin.html
3. Máy chủ Node: server.js
4. Dữ liệu lưu trong data.json

Cơ chế:
- Người chơi nhập mã người chơi.
- Nếu mã có lượt > 0 thì được quay.
- Mỗi lần quay trừ 1 lượt.
- Admin đăng nhập bằng mật khẩu và cấp 3, 4 hoặc số lượt tùy ý.
- Kết quả được lưu trong data.json.
- Trọng số:
  Bao cơm trưa 1
  Cà phê 1
  100.000 VND 20
  200.000 VND 10
  50.000 VND 30
  20.000 VND 1
  Trúng Gió 80

CHẠY THỬ TRÊN MÁY:
- Cài Node.js
- Mở terminal tại thư mục này
- chạy: node server.js
- mở: http://localhost:3000
- trang admin: http://localhost:3000/admin.html
- mật khẩu mặc định: CAMILA-ADMIN-2026

LƯU Ý:
Đây là bản V3 có backend để thử nghiệm. Muốn gửi link cho bạn bè chơi từ xa, cần deploy server này lên hosting/VPS/Vercel-compatible server. Không nên dùng mật khẩu mặc định khi đưa lên Internet.
