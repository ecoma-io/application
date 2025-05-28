# Type Alias: Entries\<T\>

> **Entries**\<`T`\> = `{ [TK in keyof T]: [TK, T[TK]] }`\[keyof `T`\]

Biến đổi một kiểu object T thành một union của các tuple,
mỗi tuple chứa một khóa của T và giá trị tương ứng.

Hữu ích khi cần duyệt qua các cặp key-value của một object.

## Type Parameters

### T

`T`

Kiểu object cần được biến đổi.

## Example

```typescript
interface User {
  id: string;
  name: string;
  age: number;
}

// Entries<User> tương đương với:
// ['id', string] | ['name', string] | ['age', number]

function processUserEntries(entries: Entries<User>[]): void {
  entries.forEach(([key, value]) => {
    // key có thể là 'id', 'name', hoặc 'age'
    // value có kiểu tương ứng với key
    console.log(`${key}: ${value}`);
  });
}

const user: User = { id: 'user-1', name: 'Nguyễn Văn A', age: 30 };
const entries = Object.entries(user) as Entries<User>[];
processUserEntries(entries);
```
