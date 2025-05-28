# Type Alias: PollUntilCheckFunction()\<T\>

> **PollUntilCheckFunction**\<`T`\> = (`attempt`) => `Promise`\<`T` \| `null`\>

Hàm kiểm tra bất đồng bộ trả về T hoặc null.

## Type Parameters

### T

`T`

## Parameters

### attempt

`number`

Số lần thử hiện tại

## Returns

`Promise`\<`T` \| `null`\>

Kết quả kiểm tra hoặc null nếu chưa đạt

## Since

1.0.0
