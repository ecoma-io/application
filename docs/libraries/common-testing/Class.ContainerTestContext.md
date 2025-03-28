# Class: ContainerTestContext

Context quản lý các container test (MongoDB, PostgreSQL, RabbitMQ, v.v.)

## Since

1.1.0

## Extends

- [`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new ContainerTestContext**(): `ContainerTestContext`

#### Returns

`ContainerTestContext`

#### Inherited from

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`constructor`](/libraries/common-testing/Class.AbstractTestContext.md#constructor)

## Methods

<a id="addcontainer"></a>

### addContainer()

> **addContainer**\<`T`\>(`container`): `void`

Thêm một container vào context

#### Type Parameters

##### T

`T`

#### Parameters

##### container

Container cần quản lý

###### start

() => `Promise`\<`T`\>

###### stop

() => `Promise`\<`void`\>

#### Returns

`void`

---

<a id="getstartedcontainer"></a>

### getStartedContainer()

> **getStartedContainer**\<`T`\>(`index`): `T`

Lấy container đã khởi động theo index

#### Type Parameters

##### T

`T`

#### Parameters

##### index

`number`

Vị trí của container trong danh sách

#### Returns

`T`

Container đã khởi động

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

Khởi động tất cả các container đã thêm

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`setup`](/libraries/common-testing/Class.AbstractTestContext.md#setup)

---

<a id="teardown"></a>

### teardown()

> **teardown**(): `Promise`\<`void`\>

Dừng tất cả các container đã khởi động

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractTestContext`](/libraries/common-testing/Class.AbstractTestContext.md).[`teardown`](/libraries/common-testing/Class.AbstractTestContext.md#teardown)
