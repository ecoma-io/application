# Type Alias: KeysOf\<T\>

> **KeysOf**\<`T`\> = keyof `T`

Trích xuất các khóa của một kiểu dữ liệu.

Đây là một alias cho `keyof T` nhưng với tên rõ ràng hơn về mục đích sử dụng.

## Type Parameters

### T

`T`

Kiểu dữ liệu cần trích xuất các khóa.

## Example

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// KeysOf<User> tương đương với 'id' | 'name' | 'email' | 'age'

// Hàm truy cập thuộc tính động
function getProperty<T, K extends KeysOf<T>>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 'user-1', name: 'Nguyễn Văn A', email: 'a@example.com', age: 30 };

// Sử dụng
const userName = getProperty(user, 'name'); // Kiểu dữ liệu: string
const userAge = getProperty(user, 'age'); // Kiểu dữ liệu: number

// Không hợp lệ, sẽ gây lỗi TypeScript
// const invalid = getProperty(user, 'invalid');
```
