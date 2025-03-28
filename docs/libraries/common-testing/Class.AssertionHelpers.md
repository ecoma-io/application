# Class: AssertionHelpers

## Constructors

<a id="constructor"></a>

### Constructor

> **new AssertionHelpers**(): `AssertionHelpers`

#### Returns

`AssertionHelpers`

## Methods

<a id="expectarraytocontainall"></a>

### expectArrayToContainAll()

> `static` **expectArrayToContainAll**\<`T`\>(`actual`, `expected`): `void`

Kiểm tra xem một array có chứa tất cả các elements của array khác không

#### Type Parameters

##### T

`T`

#### Parameters

##### actual

`T`[]

##### expected

`T`[]

#### Returns

`void`

---

<a id="expectdatetobebetween"></a>

### expectDateToBeBetween()

> `static` **expectDateToBeBetween**(`actual`, `start`, `end`): `void`

Kiểm tra xem một date có nằm trong khoảng thời gian cho trước không

#### Parameters

##### actual

`Date`

##### start

`Date`

##### end

`Date`

#### Returns

`void`

---

<a id="expectstringtomatch"></a>

### expectStringToMatch()

> `static` **expectStringToMatch**(`actual`, `pattern`): `void`

Kiểm tra xem một string có match với regex pattern không

#### Parameters

##### actual

`string`

##### pattern

`RegExp`

#### Returns

`void`

---

<a id="expecttobeinstanceof"></a>

### expectToBeInstanceOf()

> `static` **expectToBeInstanceOf**\<`T`\>(`actual`, `expectedType`): `void`

Kiểm tra xem một object có đúng type không

#### Type Parameters

##### T

`T`

#### Parameters

##### actual

`unknown`

##### expectedType

(...`args`) => `T`

#### Returns

`void`

---

<a id="expecttocontainallproperties"></a>

### expectToContainAllProperties()

> `static` **expectToContainAllProperties**\<`T`\>(`actual`, `expected`): `void`

Kiểm tra xem một object có chứa tất cả các properties của object khác không

#### Type Parameters

##### T

`T` _extends_ `object`

#### Parameters

##### actual

`T`

##### expected

`Partial`\<`T`\>

#### Returns

`void`

---

<a id="expecttothrowwithmessage"></a>

### expectToThrowWithMessage()

> `static` **expectToThrowWithMessage**(`fn`, `expectedMessage`): `void`

Kiểm tra xem một function có throw error với message cho trước không

#### Parameters

##### fn

() => `void`

##### expectedMessage

`string` | `RegExp`

#### Returns

`void`
