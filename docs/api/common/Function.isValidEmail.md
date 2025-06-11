# Function: isValidEmail()

> **isValidEmail**(`email`): `boolean`

Kiểm tra xem một chuỗi có phải là email hợp lệ không.
Sử dụng regex để kiểm tra định dạng email cơ bản.

## Parameters

### email

`string`

Chuỗi cần kiểm tra

## Returns

`boolean`

true nếu là email hợp lệ, false nếu không hợp lệ

## Example

```typescript
isValidEmail('user@example.com'); // true
isValidEmail('invalid.email'); // false
```
