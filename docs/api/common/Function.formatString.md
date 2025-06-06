# Function: formatString()

> **formatString**(`template`, ...`args`): `string`

Format một chuỗi theo template với các tham số thay thế.
Các placeholder trong template được định dạng {0}, {1}, etc.

## Parameters

### template

`string`

Chuỗi template cần format

### args

...`unknown`[]

Các tham số để thay thế vào template

## Returns

`string`

Chuỗi đã được format

## Example

```typescript
formatString('Hello {0}!', 'World'); // 'Hello World!'
formatString('{0} + {1} = {2}', 1, 2, 3); // '1 + 2 = 3'
```
