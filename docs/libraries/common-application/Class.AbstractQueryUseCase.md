# Class: `abstract` AbstractQueryUseCase\<TQuery\>

## Type Parameters

### TQuery

`TQuery` _extends_ `PlainObject`

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractQueryUseCase**\<`TQuery`\>(): `AbstractQueryUseCase`\<`TQuery`\>

#### Returns

`AbstractQueryUseCase`\<`TQuery`\>

## Methods

<a id="execute"></a>

### execute()

> **execute**(`query`): `Promise`\<`void`\>

#### Parameters

##### query

`TQuery`

#### Returns

`Promise`\<`void`\>

---

<a id="handle"></a>

### handle()

> `abstract` `protected` **handle**(`command`): `Promise`\<`void`\>

#### Parameters

##### command

`TQuery`

#### Returns

`Promise`\<`void`\>

---

<a id="validate"></a>

### validate()

> `protected` **validate**(`command`): `void`

#### Parameters

##### command

`TQuery`

#### Returns

`void`
