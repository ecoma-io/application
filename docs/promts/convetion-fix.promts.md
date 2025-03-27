Review lại source code của toàn bộ các project trong thư mục chỉ định để đảm bảo tuân thủ @coding-convention.md

Yêu cầu:

- Đảm bão mỗi thư mục trong thư viện luôn có file index.ts và mọi import phải import từ thư mục gần nhất
- Đảm bảo JSDoc được viết bằng tiếng việt và đầy đủ
- Đảm bảo README của các thư viện phản ánh đúng bản chất của thư viện và cung cấp đầy đủ các ví dụ sử dụng
- Đảm bảo các error message phải viết bằng tiếng anh và message sử dụng "{}" để đánh dấu các tham số thay thế. Trong các dự án _-domain thì các error phải kế thừa DomainError (@ecoma/common-domain). Trong các dự án _-application thì các error phải kế thừa ApplcationError (@ecoma/common-applicaton) các dự án \*-infrastructure thì các error phải kế thừa InfrastructureError (@ecoma/common-infrastructure)
- Đảm bảo các log message phải viết bằng tiếng anh
- Sửa xong project nào thì chạy `nx lint [tên-project] --fix`, `nx build [tên-project]`, `nx test[tên-project` và sửa hết các lỗi hiển thị
- Tuyệt đối không thay đổi logic của các file
