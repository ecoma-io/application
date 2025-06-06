# Function: getQueryParams()

> **getQueryParams**(`url`): `Record`\<`string`, `string`\>

Lấy query parameters từ một URL

## Parameters

### url

`string`

URL cần parse

## Returns

`Record`\<`string`, `string`\>

Object chứa các query parameters

## Example

```ts
getQueryParams('https://example.com?foo=bar&baz=qux'); // { foo: 'bar', baz: 'qux' }
```

## Since

1.0.0
