# Class: CompositeTestContext

Context quản lý nhiều test context con, hỗ trợ nested context.

## Since

1.1.0

## Extends

- [`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new CompositeTestContext**(): `CompositeTestContext`

#### Returns

`CompositeTestContext`

#### Inherited from

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`constructor`](/libraries/common-testing/Class.AbstractTestContext.md#constructor)

## Methods

<a id="addcontext"></a>

### addContext()

> **addContext**(`context`): `void`

Thêm một test context con

#### Parameters

##### context

[`ITestContext`](/libraries/common-testing/Interface.ITestContext.md)

Test context cần thêm

#### Returns

`void`

---

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

#### Inherited from

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`run`](/libraries/common-testing/Class.AbstractTestContext.md#run)

---

<a id="setup"></a>

### setup()

> **setup**(): `Promise`\<`void`\>

Thiết lập tất cả các test context con theo thứ tự thêm vào

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`setup`](/libraries/common-testing/Class.AbstractTestContext.md#setup)

---

<a id="teardown"></a>

### teardown()

> **teardown**(): `Promise`\<`void`\>

Dọn dẹp tất cả các test context con theo thứ tự ngược lại

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`teardown`](/libraries/common-testing/Class.AbstractTestContext.md#teardown)
