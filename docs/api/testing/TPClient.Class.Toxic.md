# Class: Toxic\<T\>

## Type Parameters

### T

`T`

## Constructors

<a id="constructor"></a>

### Constructor

> **new Toxic**\<`T`\>(`api`, `proxyPath`, `body`): `Toxic`\<`T`\>

#### Parameters

##### api

`AxiosInstance`

##### proxyPath

`string`

##### body

[`ICreateToxicBody`](/api/testing/TPClient.Interface.ICreateToxicBody.md)\<`T`\>

#### Returns

`Toxic`\<`T`\>

## Properties

<a id="api"></a>

### api

> `readonly` **api**: `AxiosInstance`

***

<a id="attributes"></a>

### attributes

> `readonly` **attributes**: `T`

***

<a id="name"></a>

### name

> `readonly` **name**: `string`

***

<a id="proxypath"></a>

### proxyPath

> `readonly` **proxyPath**: `string`

***

<a id="stream"></a>

### stream

> `readonly` **stream**: [`ToxicDirection`](/api/testing/TPClient.TypeAlias.ToxicDirection.md)

***

<a id="toxicity"></a>

### toxicity

> `readonly` **toxicity**: `number`

***

<a id="type"></a>

### type

> `readonly` **type**: [`ToxicType`](/api/testing/TPClient.TypeAlias.ToxicType.md)

## Methods

<a id="getpath"></a>

### getPath()

> **getPath**(): `string`

#### Returns

`string`

***

<a id="remove"></a>

### remove()

> **remove**(): `Promise`\<`void`\>

Deletes the toxic from the server.

#### Returns

`Promise`\<`void`\>

***

<a id="tojson"></a>

### toJson()

> **toJson**(): `ToxicJson`\<`T`\>

#### Returns

`ToxicJson`\<`T`\>

***

<a id="update"></a>

### update()

> **update**(`body`): `Promise`\<`Toxic`\<`T`\>\>

Updates the toxic's attributes on the server.

#### Parameters

##### body

`IUpdateToxicBody`\<`T`\>

Toxic attributes to update

#### Returns

`Promise`\<`Toxic`\<`T`\>\>

Toxic with updated attributes
