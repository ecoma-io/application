# Type Alias: PartialWithRequired\<T, TK\>

> **PartialWithRequired**\<`T`, `TK`\> = `Partial`\<`T`\> & `Pick`\<`T`, `TK`\>

Một utility type làm tất cả các thuộc tính trong T trở thành optional,
ngoại trừ các thuộc tính được chỉ định trong TK vẫn giữ nguyên là required.

Hữu ích khi bạn muốn một số thuộc tính bắt buộc nhưng các thuộc tính khác là tùy chọn.

## Type Parameters

### T

`T`

Kiểu dữ liệu cần được biến đổi.

### TK

`TK` *extends* keyof `T`

Các khóa của T cần giữ nguyên là required.

## Example

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
}

// UserUpdateForm yêu cầu id bắt buộc, các trường khác là tùy chọn
type UserUpdateForm = PartialWithRequired<User, 'id'>;

// Hợp lệ - chỉ cần cung cấp id
const update1: UserUpdateForm = { id: 'user-1' };

// Hợp lệ - cung cấp id và một số trường khác
const update2: UserUpdateForm = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  email: 'a@example.com'
};

// Không hợp lệ - thiếu id
// const update3: UserUpdateForm = { name: 'Nguyễn Văn A' };
```
