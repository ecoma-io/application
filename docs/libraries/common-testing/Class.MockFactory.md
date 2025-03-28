# Class: MockFactory

## Constructors

<a id="constructor"></a>

### Constructor

> **new MockFactory**(): `MockFactory`

#### Returns

`MockFactory`

## Methods

<a id="clearallmocks"></a>

### clearAllMocks()

> `static` **clearAllMocks**(): `void`

Clear tất cả các mocks

#### Returns

`void`

---

<a id="createmockclass"></a>

### createMockClass()

> `static` **createMockClass**\<`T`\>(`implementation`): `Mock`\<`FunctionLike`\>

Tạo một mock implementation cho một class

#### Type Parameters

##### T

`T` _extends_ (...`args`) => `unknown`

#### Parameters

##### implementation

`Partial`\<`InstanceType`\<`T`\>\>

#### Returns

`Mock`\<`FunctionLike`\>

---

<a id="createmockfn"></a>

### createMockFn()

> `static` **createMockFn**\<`T`\>(`implementation?`): `Mock`\<`FunctionLike`\>

Tạo một mock function với implementation mặc định

#### Type Parameters

##### T

`T` _extends_ (...`args`) => `unknown`

#### Parameters

##### implementation?

`T`

#### Returns

`Mock`\<`FunctionLike`\>

---

<a id="createmockobject"></a>

### createMockObject()

> `static` **createMockObject**\<`T`\>(`methods`): `T`

Tạo một mock object với các methods được mock

#### Type Parameters

##### T

`T` _extends_ `object`

#### Parameters

##### methods

`Partial`\<`Record`\<keyof `T`, `Mock`\<`FunctionLike`\>\>\>

#### Returns

`T`

---

<a id="createspy"></a>

### createSpy()

> `static` **createSpy**\<`T`, `TKey`\>(`object`, `method`): `SpyInstance`

Tạo một spy trên một method của object

#### Type Parameters

##### T

`T` _extends_ `object`

##### TKey

`TKey` _extends_ `string` \| `number` \| `symbol`

#### Parameters

##### object

`T`

##### method

`TKey`

#### Returns

`SpyInstance`

---

<a id="resetallmocks"></a>

### resetAllMocks()

> `static` **resetAllMocks**(): `void`

Reset tất cả các mocks

#### Returns

`void`
