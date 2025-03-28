# Type Alias: XOR\<T, TU\>

> **XOR**\<`T`, `TU`\> = `T` \| `TU` _extends_ `object` ? `T` _extends_ `object` ? `{ [P in Exclude<keyof T, keyof TU>]?: never }` & `TU` : `T` : `T` \| `TU`

Đại diện cho một kiểu cho phép hoặc T hoặc TU, nhưng không phải cả hai.

Hữu ích khi bạn muốn đảm bảo rằng một đối tượng chỉ có thuộc tính từ một trong hai kiểu,
không phải là sự kết hợp của cả hai.

## Type Parameters

### T

`T`

Kiểu thứ nhất.

### TU

`TU`

Kiểu thứ hai.

## Example

```typescript
// Định nghĩa hai interface không tương thích
interface LoginCredentials {
  email: string;
  password: string;
}

interface SocialLoginCredentials {
  provider: "google" | "facebook" | "github";
  token: string;
}

// Tạo một type cho phép một trong hai loại đăng nhập, nhưng không phải cả hai
type AuthCredentials = XOR<LoginCredentials, SocialLoginCredentials>;

// Hàm xử lý đăng nhập
function authenticate(credentials: AuthCredentials): void {
  if ("email" in credentials) {
    console.log(`Đăng nhập bằng email: ${credentials.email}`);
  } else {
    console.log(`Đăng nhập qua ${credentials.provider}`);
  }
}

// Hợp lệ - đăng nhập bằng email/password
authenticate({ email: "user@example.com", password: "123456" });

// Hợp lệ - đăng nhập qua mạng xã hội
authenticate({ provider: "google", token: "google-token" });

// Không hợp lệ - kết hợp cả hai
// authenticate({ email: 'user@example.com', password: '123456', provider: 'google', token: 'google-token' });
```
