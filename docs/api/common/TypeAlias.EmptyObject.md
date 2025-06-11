# Type Alias: EmptyObject

> **EmptyObject** = `Record`\<`string`, `never`\>

Đại diện cho một đối tượng không có thuộc tính nào.

Hữu ích khi bạn cần định nghĩa rõ ràng một đối tượng trống trong các định nghĩa kiểu.

## Example

```typescript
// Định nghĩa một hàm không nhận tham số đầu vào
function initialize(options: EmptyObject = {}): void {
  console.log('Khởi tạo với đối tượng trống');
}

// Sử dụng hợp lệ
initialize({});

// Không hợp lệ, sẽ gây lỗi TypeScript
// initialize({ debug: true });
```
