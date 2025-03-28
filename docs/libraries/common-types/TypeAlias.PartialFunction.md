# Type Alias: PartialFunction()\<T\>

> **PartialFunction**\<`T`\> = (...`args`) => `ReturnType`\<`T`\>

Đại diện cho một kiểu hàm với các tham số được áp dụng một phần.

Hữu ích khi bạn muốn gọi một hàm với chỉ một số tham số, để các tham số còn lại là undefined.

## Type Parameters

### T

`T` _extends_ (...`args`) => `any`

Một kiểu hàm mà các tham số của nó sẽ được áp dụng một phần.

## Parameters

### args

...`Partial`\<`Parameters`\<`T`\>\>

## Returns

`ReturnType`\<`T`\>

## Example

```typescript
// Định nghĩa một hàm với nhiều tham số
function createUser(id: string, name: string, age: number, email: string): User {
  return { id, name, age, email };
}

// Sử dụng PartialFunction để chỉ cung cấp một số tham số
const createPartialUser: PartialFunction<typeof createUser> = (id, name) => {
  // Các tham số không được cung cấp sẽ là undefined
  return createUser(id!, name!, 0, "");
};

// Gọi hàm với chỉ một số tham số
const user = createPartialUser("user-1", "Nguyễn Văn A");
```
