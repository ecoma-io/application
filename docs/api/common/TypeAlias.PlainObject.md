# Type Alias: PlainObject

> **PlainObject** = `object`

Đại diện cho một đối tượng đơn giản với các khóa là string và giá trị có thể là bất kỳ kiểu nào.

Hữu ích khi làm việc với các đối tượng có cấu trúc không xác định hoặc động.

## Index Signature

\[`key`: `string`\]: `any`

## Warning

Nên hạn chế sử dụng kiểu này vì nó làm mất đi lợi ích của type checking.
Chỉ sử dụng khi thực sự cần thiết, như khi làm việc với dữ liệu JSON không xác định.

## Example

```typescript
// Hàm xử lý dữ liệu từ API với cấu trúc không xác định
function processApiResponse(data: PlainObject): void {
  // Truy cập các thuộc tính một cách an toàn
  if (typeof data.status === 'string') {
    console.log(`Trạng thái: ${data.status}`);
  }

  // Kiểm tra và xử lý dữ liệu động
  Object.keys(data).forEach((key) => {
    console.log(`${key}: ${JSON.stringify(data[key])}`);
  });
}
```
