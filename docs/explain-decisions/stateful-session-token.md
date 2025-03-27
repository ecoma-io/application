# **Quyết định: Sử dụng Session Token Stateful trong IAM**

## **1\. Vấn đề**

Trong hệ thống Ecoma, chúng ta cần có một chiến lược xác thực an toàn và hiệu quả cho người dùng. Có hai lựa chọn chính phổ biến:

- **Token stateless (JWT)**: Thông tin xác thực được mã hóa trực tiếp trong token, không cần lưu trữ phía server.
- **Session token stateful**: Token đại diện cho một phiên làm việc được lưu trữ trong cơ sở dữ liệu server.

Việc lựa chọn chiến lược xác thực phù hợp rất quan trọng vì nó ảnh hưởng đến nhiều khía cạnh của hệ thống như bảo mật, hiệu năng, trải nghiệm người dùng và khả năng mở rộng.

## **2\. Đánh giá các phương án**

### **2.1. JWT (Stateless Token)**

**Ưu điểm:**
- Không cần lưu trữ thông tin phiên trên server, giảm tải cho cơ sở dữ liệu
- Dễ dàng mở rộng ngang (horizontally scalable)
- Không cần đồng bộ giữa các service khi triển khai microservices
- Hiệu suất cao vì không cần truy vấn CSDL khi xác thực

**Nhược điểm:**
- Không thể vô hiệu hóa token từ xa ngay lập tức (token vẫn hợp lệ cho đến khi hết hạn)
- Quyền hạn được lưu trong token không thể thay đổi cho đến khi phát hành token mới
- Tăng kích thước request do token chứa nhiều thông tin
- Tấn công XSS có thể đánh cắp token và sử dụng từ bất kỳ đâu

### **2.2. Session Token Stateful**

**Ưu điểm:**
- Có thể vô hiệu hóa phiên làm việc ngay lập tức từ xa
- Thông tin và quyền hạn luôn cập nhật theo thời gian thực
- Token nhỏ gọn, giảm kích thước request
- Kiểm soát tốt hơn đối với phiên làm việc của người dùng
- Dễ dàng theo dõi và quản lý tất cả phiên làm việc đang hoạt động

**Nhược điểm:**
- Yêu cầu lưu trữ và quản lý phiên trên server
- Cần chiến lược cache phù hợp để đảm bảo hiệu suất
- Phức tạp hơn khi triển khai trong môi trường phân tán

## **3\. Quyết định**

**Chúng tôi quyết định sử dụng Session Token Stateful cho xác thực trong hệ thống Ecoma.**

## **4\. Lý do**

Trong bối cảnh yêu cầu của hệ thống Ecoma, chúng tôi ưu tiên Session Token Stateful bởi các lý do sau:

1. **Đăng xuất từ xa tức thời**: Hệ thống cần khả năng vô hiệu hóa phiên làm việc ngay lập tức khi:
   - Người dùng đăng xuất từ tất cả thiết bị
   - Quản trị viên cần khóa tài khoản vì lý do bảo mật
   - Phát hiện hoạt động đáng ngờ

2. **Cập nhật quyền theo thời gian thực**: Khi vai trò (role) hoặc quyền hạn của người dùng trong tổ chức thay đổi, những thay đổi này cần được áp dụng ngay lập tức. Với JWT, người dùng sẽ giữ quyền cũ cho đến khi token hết hạn hoặc họ đăng xuất và đăng nhập lại.

3. **Quản lý nhiều phiên làm việc**: Nhu cầu theo dõi và quản lý các phiên làm việc đang hoạt động của người dùng, bao gồm khả năng liệt kê và chấm dứt từng phiên cụ thể.

4. **Đồng bộ trạng thái tổ chức**: Trong mô hình tổ chức đa người dùng, việc cập nhật trạng thái tổ chức (ví dụ: từ Active sang Suspended) cần được áp dụng ngay lập tức cho tất cả người dùng.

5. **Mở rộng thông tin phiên làm việc**: Cần lưu thông tin bổ sung về phiên làm việc như context tổ chức hiện tại, thời điểm tạo, thiết bị đăng nhập, v.v.

## **5\. Triển khai**

Để đảm bảo hiệu suất khi sử dụng Session Token Stateful, chúng tôi sẽ:

1. **Sử dụng Redis làm cache layer**: Lưu trữ thông tin session token trong Redis để truy xuất nhanh, với backup trong PostgreSQL.

2. **Chuẩn hóa quy trình vô hiệu hóa token**: Xây dựng cơ chế để vô hiệu hóa tất cả phiên của một người dùng hoặc các phiên cụ thể.

3. **Tối ưu hóa thao tác kiểm tra token**: Sử dụng cấu trúc dữ liệu và chỉ mục hiệu quả để xác thực token nhanh chóng.

4. **Chiến lược quản lý token hết hạn**: Triển khai cơ chế tự động dọn dẹp token hết hạn.

## **6\. Đánh giá tác động**

- **Bảo mật**: Tăng cường nhờ khả năng vô hiệu hóa token ngay lập tức và kiểm soát tốt hơn các phiên làm việc.
- **Hiệu suất**: Có thể bị ảnh hưởng nhẹ do cần truy vấn CSDL/cache, nhưng được giảm thiểu với chiến lược cache hợp lý.
- **Khả năng mở rộng**: Yêu cầu lưu ý về đồng bộ hóa session trong môi trường phân tán.
- **Trải nghiệm người dùng**: Cải thiện nhờ quản lý phiên tốt hơn và khả năng đồng bộ quyền theo thời gian thực.

## **7\. Kết luận**

Mặc dù JWT có một số ưu điểm về hiệu suất và đơn giản trong triển khai, Session Token Stateful cung cấp mức độ kiểm soát và bảo mật cao hơn, đáp ứng tốt hơn các yêu cầu của hệ thống Ecoma về quản lý phiên làm việc, cập nhật quyền theo thời gian thực và vô hiệu hóa phiên từ xa. 
