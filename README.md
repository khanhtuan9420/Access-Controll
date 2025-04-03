# Hệ thống quản lý ra vào

Ứng dụng web sử dụng ReactJS để quản lý việc ra vào cho một khu vực.

## Tính năng

- Đăng nhập/Đăng xuất
- Quản lý người dùng (thêm, sửa, xóa, xem chi tiết)
- Quản lý thiết bị (cửa) (thêm, sửa, xóa)
- Lập lịch và phân quyền ra vào

## Hướng dẫn cài đặt

1. Clone repository
2. Cài đặt các dependencies:
   ```
   npm install
   ```
3. Chạy dự án:
   ```
   npm start
   ```

## Cách sử dụng

### Đăng nhập

- Sử dụng thông tin đăng nhập mặc định:
  - Tên đăng nhập: admin
  - Mật khẩu: admin123

### Quản lý người dùng

- Xem danh sách người dùng
- Thêm người dùng mới
- Chỉnh sửa thông tin người dùng
- Xóa người dùng
- Xem chi tiết người dùng

### Quản lý thiết bị

- Xem danh sách thiết bị
- Thêm thiết bị mới
- Chỉnh sửa thông tin thiết bị
- Xóa thiết bị

### Lập lịch và phân quyền

- Phân quyền người dùng với thiết bị
- Xem lịch sử phân quyền

## Công nghệ sử dụng

- ReactJS
- TypeScript
- Material-UI
- React Router
- Context API

## Lưu ý

Đây là phiên bản demo với dữ liệu mẫu. Trong môi trường thực tế, cần tích hợp với API backend.

## Triển khai với Docker

Dự án này có thể được triển khai dễ dàng sử dụng Docker. Có hai môi trường được cấu hình:

### Môi trường phát triển (Development)

Môi trường phát triển sử dụng `Dockerfile.dev` và `docker-compose.dev.yml`, giúp triển khai nhanh chóng với tính năng hot-reload:

```bash
# Xây dựng và chạy ứng dụng trong môi trường phát triển
docker-compose -f docker-compose.dev.yml up --build
```

### Môi trường sản phẩm (Production)

Môi trường sản phẩm sử dụng `Dockerfile` và `docker-compose.yml` chuẩn:

```bash
# Xây dựng và chạy ứng dụng trong môi trường sản phẩm
docker-compose up --build
```

Sau khi ứng dụng được khởi động, bạn có thể truy cập:
- Ứng dụng web: http://localhost:3000
