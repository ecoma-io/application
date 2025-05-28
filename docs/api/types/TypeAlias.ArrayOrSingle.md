# Type Alias: ArrayOrSingle\<T\>

> **ArrayOrSingle**\<`T`\> = `T` \| `T`[]

Đại diện cho một giá trị có thể là một phần tử đơn lẻ hoặc một mảng các phần tử cùng kiểu.

Hữu ích khi một hàm có thể chấp nhận cả một giá trị đơn lẻ hoặc một mảng giá trị.

## Type Parameters

### T

`T`

Kiểu dữ liệu của các phần tử.

## Example

```typescript
// Định nghĩa hàm có thể xử lý một hoặc nhiều ID
function deleteItems(ids: ArrayOrSingle<string>): void {
  const idArray = Array.isArray(ids) ? ids : [ids];
  // Xử lý mảng ID
  idArray.forEach(id => console.log(`Xóa item ${id}`));
}

// Sử dụng với một giá trị đơn
deleteItems('item-1');

// Hoặc với một mảng giá trị
deleteItems(['item-1', 'item-2', 'item-3']);
```
