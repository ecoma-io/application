# Function: getHostname()

> **getHostname**(`url`): `null` \| `string`

Lấy hostname từ một URL

## Parameters

### url

`string`

URL cần parse

## Returns

`null` \| `string`

Hostname hoặc null nếu URL không hợp lệ

## Example

```ts
getHostname('https://example.com/path'); // 'example.com'
```

## Since

1.0.0
