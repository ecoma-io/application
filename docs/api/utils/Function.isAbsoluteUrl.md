# Function: isAbsoluteUrl()

> **isAbsoluteUrl**(`url`): `boolean`

Kiểm tra xem một URL có phải là URL tuyệt đối không

## Parameters

### url

`string`

URL cần kiểm tra

## Returns

`boolean`

True nếu là URL tuyệt đối, ngược lại là False

## Example

```ts
isAbsoluteUrl('https://example.com'); // true
isAbsoluteUrl('/path/to/resource'); // false
```

## Since

1.0.0
