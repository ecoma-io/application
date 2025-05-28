# Type Alias: ExcludeFromUnion\<T, TU\>

> **ExcludeFromUnion**\<`T`, `TU`\> = `T` *extends* `TU` ? `never` : `T`

Loại bỏ các kiểu từ một union type.

Hữu ích khi bạn muốn loại bỏ một số kiểu cụ thể từ một union type.

## Type Parameters

### T

`T`

Union type cần loại bỏ các kiểu.

### TU

`TU`

Các kiểu cần loại bỏ khỏi union.

## Example

```typescript
// Định nghĩa một union type
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

// Tạo một type mới chỉ chứa các phương thức không an toàn
type UnsafeHttpMethod = ExcludeFromUnion<HttpMethod, 'GET' | 'OPTIONS' | 'HEAD'>;
// Kết quả: 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Sử dụng trong hàm yêu cầu xác thực
function requiresAuthentication(method: UnsafeHttpMethod): boolean {
  return true; // Tất cả các phương thức không an toàn đều yêu cầu xác thực
}

// Hợp lệ
requiresAuthentication('POST');
requiresAuthentication('DELETE');

// Không hợp lệ, sẽ gây lỗi TypeScript
// requiresAuthentication('GET');
```
