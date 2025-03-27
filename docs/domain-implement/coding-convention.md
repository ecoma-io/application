# Coding Convention (Quy ước lập trình chung Ecoma)

Tài liệu này quy định các quy tắc coding convention bắt buộc áp dụng cho toàn bộ dự án Ecoma, bao gồm tất cả các tầng: Domain, Application, Infrastructure. Ngoài các quy tắc chung này, mỗi tầng có thể có thêm các quy định riêng, xem chi tiết trong tài liệu hướng dẫn từng tầng.

## 1. Quy tắc đặt tên (Naming Convention)

Áp dụng theo cấu hình ESLint (`eslint.config.mjs`):
- **Class:** PascalCase. Nếu là abstract class, phải có prefix `Abstract`.
- **Interface:** PascalCase, prefix `I` (ví dụ: `IUserRepository`).
- **Type alias, Enum:** PascalCase.
- **Enum member:** PascalCase hoặc UPPER_CASE.
- **Type parameter:** PascalCase, prefix `T`.
- **Biến:** camelCase, PascalCase hoặc UPPER_CASE (nếu là const/exported).
- **Hàm, method:** camelCase hoặc PascalCase.
- **Parameter:** camelCase, cho phép leading underscore.
- **Không được dùng tên bắt đầu bằng `__` cho biến (trừ trường hợp đặc biệt do tool sinh ra). 
- **Không dùng console.log** (quy tắc `no-console`).

## 2. Quy tắc về tổ chức code
- Tất cả source code phải có JsDoc đầy đủ. JSDoc phải viết bằng ngôn ngữ tiếng Việt.
- Tên toàn bộ các test case phải viết bằng tiếng Việt.
- Những gì còn lại phải được viết bằng tiếng Anh.
- Tổ chức project thành các thư mục con thì mỗi thư mục con phải có file `index.ts`. Khi import thì import từ thư mục, không import trực tiếp file con.

## 3. Quy tắc về kiểm thử
- Không tắt các rule kiểm tra kiểu dữ liệu trừ khi thực sự cần thiết (ví dụ: `@typescript-eslint/no-explicit-any` chỉ tắt cho file test).

## 4. Quy tắc khác
- Tuân thủ các quy tắc về module boundaries, không import sai tầng hoặc vượt rào giữa các bounded context (theo cấu hình ESLint).

---

**Lưu ý:**
- Mỗi tầng (domain, application, infrastructure) có thể có thêm các quy định riêng, xem chi tiết trong tài liệu hướng dẫn tương ứng.
- Nếu có mâu thuẫn giữa quy tắc chung và quy tắc riêng từng tầng, quy tắc riêng sẽ được ưu tiên cho tầng đó. 
