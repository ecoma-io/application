# Class: TestUtils

## Constructors

<a id="constructor"></a>

### Constructor

> **new TestUtils**(): `TestUtils`

#### Returns

`TestUtils`

## Methods

<a id="createarray"></a>

### createArray()

> `static` **createArray**\<`T`\>(`length`, `factory`): `T`[]

Tạo một array với số lượng elements cho trước

#### Type Parameters

##### T

`T`

#### Parameters

##### length

`number`

##### factory

(`index`) => `T`

#### Returns

`T`[]

---

<a id="createrandomobject"></a>

### createRandomObject()

> `static` **createRandomObject**\<`T`\>(`template`, `overrides?`): `T`

Tạo một object với các properties ngẫu nhiên

#### Type Parameters

##### T

`T` _extends_ `object`

#### Parameters

##### template

`T`

##### overrides?

`Partial`\<`T`\>

#### Returns

`T`

---

<a id="deepcopy"></a>

### deepCopy()

> `static` **deepCopy**\<`T`\>(`obj`): `T`

Tạo một deep copy của object

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

---

<a id="delay"></a>

### delay()

> `static` **delay**(`ms`): `Promise`\<`void`\>

Tạo một delay với thời gian cho trước

#### Parameters

##### ms

`number`

#### Returns

`Promise`\<`void`\>

---

<a id="retry"></a>

### retry()

> `static` **retry**\<`T`\>(`fn`, `maxAttempts`, `delayMs`): `Promise`\<`T`\>

Tạo một retry function

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### maxAttempts

`number`

##### delayMs

`number`

#### Returns

`Promise`\<`T`\>

---

<a id="timeout"></a>

### timeout()

> `static` **timeout**(`ms`): `Promise`\<`never`\>

Tạo một timeout promise

#### Parameters

##### ms

`number`

#### Returns

`Promise`\<`never`\>
