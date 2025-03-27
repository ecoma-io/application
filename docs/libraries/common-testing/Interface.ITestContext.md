# Interface: ITestContext

Interface mô tả một test context có thể quản lý vòng đời (lifecycle) của test.

## Since

1.1.0

## Methods

<a id="setup"></a>

### setup()

> **setup**(): `Promise`\<`void`\>

Thiết lập môi trường test trước khi chạy test

#### Returns

`Promise`\<`void`\>

***

<a id="teardown"></a>

### teardown()

> **teardown**(): `Promise`\<`void`\>

Dọn dẹp môi trường test sau khi chạy test

#### Returns

`Promise`\<`void`\>
