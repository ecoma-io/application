# Function: isValidUrl()

> **isValidUrl**(`url`): `boolean`

Kiểm tra xem một chuỗi có phải là URL hợp lệ không.
Sử dụng URL constructor để validate.

## Parameters

### url

`string`

Chuỗi cần kiểm tra

## Returns

`boolean`

true nếu là URL hợp lệ, false nếu không hợp lệ

## Example

```typescript
isValidUrl('https://example.com'); // true
isValidUrl('not-a-url'); // false
```
