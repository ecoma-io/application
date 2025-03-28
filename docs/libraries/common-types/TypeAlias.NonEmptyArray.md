# Type Alias: NonEmptyArray\<T\>

> **NonEmptyArray**\<`T`\> = \[`T`, `...T[]`\]

Đại diện cho một mảng được đảm bảo có ít nhất một phần tử.

Hữu ích khi bạn cần đảm bảo một mảng không rỗng trong các tham số hàm hoặc trả về giá trị.

## Type Parameters

### T

`T`

Kiểu dữ liệu của các phần tử trong mảng.

## Example

```typescript
// Hàm yêu cầu ít nhất một phần tử trong mảng
function processItems(items: NonEmptyArray<string>): string {
  // Chúng ta có thể an toàn truy cập phần tử đầu tiên mà không cần kiểm tra mảng rỗng
  const firstItem = items[0];
  return `Đang xử lý ${items.length} items, bắt đầu với ${firstItem}`;
}

// Hợp lệ
processItems(["item1", "item2"]);
processItems(["single-item"]);

// Không hợp lệ, sẽ gây lỗi TypeScript
// processItems([]);
```
