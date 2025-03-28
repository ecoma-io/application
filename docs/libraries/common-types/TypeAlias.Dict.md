# Type Alias: Dict\<T\>

> **Dict**\<`T`\> = `object`

Đại diện cho một dictionary với các khóa là string và giá trị có kiểu T.

Hữu ích khi làm việc với các đối tượng được sử dụng như map/dictionary.

## Type Parameters

### T

`T`

Kiểu dữ liệu của các giá trị trong dictionary.

## Index Signature

\[`key`: `string`\]: `T`

## Example

```typescript
// Dictionary lưu trữ thông tin người dùng theo ID
const userCache: Dict<User> = {
  "user-1": { id: "user-1", name: "Nguyễn Văn A" },
  "user-2": { id: "user-2", name: "Trần Thị B" },
};

// Truy cập một người dùng theo ID
const user = userCache["user-1"];

// Thêm một người dùng mới
userCache["user-3"] = { id: "user-3", name: "Lê Văn C" };
```
