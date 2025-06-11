# Type Alias: DeepPartial\<T\>

> **DeepPartial**\<`T`\> = `{ [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }`

Đệ quy làm tất cả các thuộc tính của một kiểu dữ liệu trở thành optional.

Khác với `Partial<T>` của TypeScript, kiểu này áp dụng đệ quy cho tất cả các thuộc tính lồng nhau.

## Type Parameters

### T

`T`

Kiểu dữ liệu cần được biến đổi thành deeply partial.

## Example

```typescript
interface User {
  id: string;
  name: string;
  profile: {
    avatar: string;
    preferences: {
      theme: string;
      notifications: boolean;
    };
  };
}

// Với Partial<User> thông thường, chỉ các thuộc tính cấp cao nhất là optional
const partialUser: Partial<User> = { name: 'Nguyễn Văn A' };
// Không hợp lệ: profile.preferences.theme không phải là optional
// partialUser.profile = { preferences: { } };

// Với DeepPartial<User>, tất cả các thuộc tính lồng nhau đều là optional
const deepPartialUser: DeepPartial<User> = { name: 'Nguyễn Văn A' };
// Hợp lệ
deepPartialUser.profile = { preferences: {} };
```
