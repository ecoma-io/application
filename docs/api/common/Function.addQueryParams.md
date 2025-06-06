# Function: addQueryParams()

> **addQueryParams**(`url`, `params`): `string`

Thêm query parameters vào một URL

## Parameters

### url

`string`

URL gốc

### params

`Record`\<`string`, `string` \| `number` \| `boolean`\>

Các query parameters cần thêm

## Returns

`string`

URL với query parameters đã thêm

## Example

```ts
addQueryParams('https://example.com', { foo: 'bar', baz: 123 }); // 'https://example.com?foo=bar&baz=123'
```

## Since

1.0.0
