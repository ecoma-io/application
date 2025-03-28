# Type Alias: Optional\<T\>

> **Optional**\<`T`\> = `T` \| `undefined`

Đại diện cho một kiểu có thể là kiểu T hoặc undefined.

Hữu ích cho các trường hợp một giá trị có thể có hoặc không.

## Type Parameters

### T

`T`

Kiểu dữ liệu của giá trị có thể hiện diện.

## Example

```typescript
// Định nghĩa một hàm trả về undefined khi không tìm thấy kết quả
function getUserPreference(userId: string, key: string): Optional<string> {
  const user = getUser(userId);
  return user?.preferences?.[key];
}

// Sử dụng với optional chaining
const theme = getUserPreference("user-1", "theme") ?? "default";
console.log(`Theme: ${theme}`);
```
