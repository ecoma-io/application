# Type Alias: Nullable\<T\>

> **Nullable**\<`T`\> = `T` \| `null`

Đại diện cho một giá trị có thể là kiểu T hoặc null.

Hữu ích khi một giá trị có thể không tồn tại (null) trong ngữ cảnh nhất định.

## Type Parameters

### T

`T`

Kiểu dữ liệu của giá trị có thể là nullable.

## Example

```typescript
// Định nghĩa một hàm có thể trả về null khi không tìm thấy kết quả
function findUser(id: string): Nullable<User> {
  const user = database.findById(id);
  return user || null;
}

// Sử dụng với kiểm tra null
const user = findUser("user-1");
if (user !== null) {
  console.log(`Tìm thấy người dùng: ${user.name}`);
} else {
  console.log("Không tìm thấy người dùng");
}
```
