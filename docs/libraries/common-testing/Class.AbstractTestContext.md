# Class: `abstract` AbstractTestContext

Class cơ sở cho các test context, hỗ trợ quản lý môi trường test.

## Since

1.1.0

## Extended by

- [`CompositeTestContext`](/libraries/common-testing/Class.CompositeTestContext.md)
- [`ContainerTestContext`](/libraries/common-testing/Class.ContainerTestContext.md)

## Implements

- [`ITestContext`](/libraries/common-testing/Interface.ITestContext.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractTestContext**(): `AbstractTestContext`

#### Returns

`AbstractTestContext`

## Methods

<a id="run"></a>

### run()

> **run**\<`T`\>(`fn`): `Promise`\<`T`\>

Chạy một hàm trong ngữ cảnh của test context này

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

Hàm cần chạy trong ngữ cảnh test

#### Returns

`Promise`\<`T`\>

Kết quả của hàm

***

<a id="setup"></a>

### setup()

> `abstract` **setup**(): `Promise`\<`void`\>

Thiết lập môi trường test trước khi chạy test

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITestContext`](/libraries/common-testing/Interface.ITestContext.md).[`setup`](/libraries/common-testing/Interface.ITestContext.md#setup)

***

<a id="teardown"></a>

### teardown()

> `abstract` **teardown**(): `Promise`\<`void`\>

Dọn dẹp môi trường test sau khi chạy test

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITestContext`](/libraries/common-testing/Interface.ITestContext.md).[`teardown`](/libraries/common-testing/Interface.ITestContext.md#teardown)
