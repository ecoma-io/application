# Class: MessageableValidators

## Constructors

<a id="constructor"></a>

### Constructor

> **new MessageableValidators**(): `MessageableValidators`

#### Returns

`MessageableValidators`

## Methods

<a id="email"></a>

### email()

> `static` **email**(`errorMessage`): `ValidatorFn`

#### Parameters

##### errorMessage

`string` = `"Invalid email address"`

#### Returns

`ValidatorFn`

---

<a id="fixedlength"></a>

### fixedLength()

> `static` **fixedLength**(`length`, `errorMessage`): `ValidatorFn`

#### Parameters

##### length

`number`

##### errorMessage

`string` = `...`

#### Returns

`ValidatorFn`

---

<a id="max"></a>

### max()

> `static` **max**(`max`, `errorMessage`): `ValidatorFn`

#### Parameters

##### max

`number`

##### errorMessage

`string` = `...`

#### Returns

`ValidatorFn`

---

<a id="maxlength"></a>

### maxLength()

> `static` **maxLength**(`maxLength`, `errorMessage`): `ValidatorFn`

#### Parameters

##### maxLength

`number`

##### errorMessage

`string` = `...`

#### Returns

`ValidatorFn`

---

<a id="min"></a>

### min()

> `static` **min**(`min`, `errorMessage`): `ValidatorFn`

#### Parameters

##### min

`number`

##### errorMessage

`string` = `...`

#### Returns

`ValidatorFn`

---

<a id="minlength"></a>

### minLength()

> `static` **minLength**(`minLength`, `errorMessage`): `ValidatorFn`

#### Parameters

##### minLength

`number`

##### errorMessage

`string` = `...`

#### Returns

`ValidatorFn`

---

<a id="pattern"></a>

### pattern()

> `static` **pattern**(`pattern`, `errorMessage`): `ValidatorFn`

#### Parameters

##### pattern

`RegExp`

##### errorMessage

`string` = `"Invalid format"`

#### Returns

`ValidatorFn`

---

<a id="required"></a>

### required()

> `static` **required**(`errorMessage`): `ValidatorFn`

#### Parameters

##### errorMessage

`string` = `"This field is required"`

#### Returns

`ValidatorFn`
