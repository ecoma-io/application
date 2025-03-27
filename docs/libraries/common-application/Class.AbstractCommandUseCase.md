# Class: `abstract` AbstractCommandUseCase\<TCommand, TResult\>

## Type Parameters

### TCommand

`TCommand` _extends_ `PlainObject`

### TResult

`TResult` _extends_ [`GenericResult`](/libraries/common-application/Class.GenericResult.md)\<`unknown`\> \| `void`

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractCommandUseCase**\<`TCommand`, `TResult`\>(): `AbstractCommandUseCase`\<`TCommand`, `TResult`\>

#### Returns

`AbstractCommandUseCase`\<`TCommand`, `TResult`\>

## Methods

<a id="execute"></a>

### execute()

> **execute**(`command`): `Promise`\<`void`\>

#### Parameters

##### command

`TCommand`

#### Returns

`Promise`\<`void`\>

---

<a id="handle"></a>

### handle()

> `abstract` `protected` **handle**(`command`): `Promise`\<`TResult`\>

#### Parameters

##### command

`TCommand`

#### Returns

`Promise`\<`TResult`\>

---

<a id="validate"></a>

### validate()

> `protected` **validate**(`command`): `void`

#### Parameters

##### command

`TCommand`

#### Returns

`void`
