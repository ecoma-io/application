# Type Alias: Primitive

> **Primitive** = `string` \| `number` \| `boolean` \| `symbol` \| `bigint`

Đại diện cho các kiểu dữ liệu nguyên thủy trong TypeScript.

Kiểu này bao gồm các kiểu nguyên thủy sau:

- `string`
- `number`
- `boolean`
- `symbol`
- `bigint`

## Example

```typescript
// Hàm chỉ chấp nhận các giá trị nguyên thủy
function isPrimitive(value: unknown): value is Primitive {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean' || type === 'symbol' || type === 'bigint';
}

// Sử dụng
console.log(isPrimitive('hello')); // true
console.log(isPrimitive(42)); // true
console.log(isPrimitive(true)); // true
console.log(isPrimitive(Symbol('id'))); // true
console.log(isPrimitive(BigInt(123))); // true

console.log(isPrimitive({})); // false
console.log(isPrimitive([])); // false
console.log(isPrimitive(null)); // false
console.log(isPrimitive(undefined)); // false
```
