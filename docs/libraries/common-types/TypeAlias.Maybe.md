# Type Alias: Maybe\<T\>

> **Maybe**\<`T`\> = [`Nullable`](/libraries/common-types/TypeAlias.Nullable.md)\<`T`\> \| [`Optional`](/libraries/common-types/TypeAlias.Optional.md)\<`T`\>

Đại diện cho một kiểu có thể là Nullable hoặc Optional.

Kết hợp cả hai kiểu Nullable và Optional, cho phép một giá trị có thể là T, null, hoặc undefined.

## Type Parameters

### T

`T`

Kiểu dữ liệu của giá trị có thể là Maybe.

## Example

```typescript
// Định nghĩa một hàm có thể trả về giá trị, null, hoặc undefined
function getConfigValue(key: string): Maybe<string> {
  if (!configExists()) return undefined; // Config chưa được khởi tạo

  const value = config.get(key);
  return value === '' ? null : value; // Trả về null cho giá trị rỗng
}

// Sử dụng với kiểm tra đầy đủ
const value = getConfigValue('api.url');
if (value !== null && value !== undefined) {
  console.log(`Giá trị cấu hình: ${value}`);
} else if (value === null) {
  console.log('Giá trị cấu hình rỗng');
} else {
  console.log('Cấu hình chưa được khởi tạo');
}
```
