# Playwright with Docker-in-Docker
Dự án này cung cấp một Docker image tùy chỉnh được xây dựng trên nền tảng Playwright chính thức (mcr.microsoft.com/playwright) và tích hợp thêm khả năng chạy Docker bên trong container (Docker-in-Docker).

Mục tiêu chính:

- Tạo ra một môi trường cô lập, sẵn sàng để thực thi các bài kiểm thử tự động với Playwright.
- Cung cấp khả năng chạy các lệnh Docker (ví dụ: xây dựng, khởi động các dịch vụ phụ trợ trong container) ngay trong quá trình kiểm thử Playwright.
Đ- ảm bảo tính nhất quán của môi trường trên nhiều nền tảng, đặc biệt hữu ích cho các hệ thống Tích hợp Liên tục/Triển khai Liên tục (CI/CD) như GitHub Actions.

Với image này, các nhà phát triển có thể tăng tốc quy trình kiểm thử bằng cách loại bỏ nhu cầu cài đặt trình duyệt và các công cụ Docker thủ công, đồng thời có thể dễ dàng kiểm thử các ứng dụng phụ thuộc vào Docker ngay trong môi trường kiểm thử Playwright.