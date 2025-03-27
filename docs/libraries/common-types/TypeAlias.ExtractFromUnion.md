# Type Alias: ExtractFromUnion\<T, TU\>

> **ExtractFromUnion**\<`T`, `TU`\> = `T` *extends* `TU` ? `T` : `never`

Trích xuất các kiểu từ một union type mà có thể gán được cho một kiểu cụ thể.

Hữu ích khi bạn muốn lọc ra các kiểu phù hợp với một điều kiện nhất định.

## Type Parameters

### T

`T`

Union type cần trích xuất.

### TU

`TU`

Kiểu mà các phần tử của union cần phù hợp.

## Example

```typescript
// Định nghĩa một số interface
interface WithId { id: string; }
interface WithName { name: string; }
interface WithEmail { email: string; }

// Tạo một union type
type Entity = WithId | WithName | WithEmail | (WithId & WithName) | (WithId & WithEmail);

// Trích xuất các kiểu có thuộc tính id
type EntityWithId = ExtractFromUnion<Entity, WithId>;
// Kết quả: WithId | (WithId & WithName) | (WithId & WithEmail)

// Sử dụng trong hàm yêu cầu id
function processEntityWithId(entity: EntityWithId): void {
  console.log(`Xử lý entity có ID: ${entity.id}`);
}

// Hợp lệ
processEntityWithId({ id: 'entity-1' });
processEntityWithId({ id: 'entity-2', name: 'Entity 2' });

// Không hợp lệ, sẽ gây lỗi TypeScript
// processEntityWithId({ name: 'Entity 3' });
```
