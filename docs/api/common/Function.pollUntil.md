# Function: pollUntil()

> **pollUntil**\<`T`\>(`checkFunction`, `options?`): `Promise`\<`undefined` \| `T`\>

Lặp lại hàm kiểm tra bất đồng bộ cho đến khi có kết quả hoặc hết số lần thử.

## Type Parameters

### T

`T`

## Parameters

### checkFunction

[`PollUntilCheckFunction`](/api/common/TypeAlias.PollUntilCheckFunction.md)\<`T`\>

Hàm kiểm tra trả về T hoặc null

### options?

[`IPollUntilOptions`](/api/common/Interface.IPollUntilOptions.md) = `{}`

Tuỳ chọn số lần thử và thời gian chờ

## Returns

`Promise`\<`undefined` \| `T`\>

Kết quả tìm được hoặc undefined nếu không có

## Example

```ts
await pollUntil(async (attempt) => (attempt > 3 ? 'done' : null), { maxRetries: 5, delayMs: 100 });
```

## Since

1.0.0
