# Interface: ICreateToxicBody\<T\>

## Extends

- `IToxicBody`\<`T`\>

## Type Parameters

### T

`T`

## Properties

<a id="attributes"></a>

### attributes

> **attributes**: `T`

Toxic attributes

#### Inherited from

`IToxicBody.attributes`

***

<a id="name"></a>

### name

> **name**: `string`

Toxic name

#### Inherited from

`IToxicBody.name`

***

<a id="stream"></a>

### stream

> **stream**: [`ToxicDirection`](/libraries/common-testing/TPClient.TypeAlias.ToxicDirection.md)

The stream direction must be either upstream or downstream.
upstream applies the toxic on the client -> server connection,
while downstream applies the toxic on the server -> client connection.
This can be used to modify requests and responses separately.

defaults to downstream

#### Inherited from

`IToxicBody.stream`

***

<a id="toxicity"></a>

### toxicity

> **toxicity**: `number`

Percentage of connections the toxic will affect.

defaults to 1.0 (100%)

#### Inherited from

`IToxicBody.toxicity`

***

<a id="type"></a>

### type

> **type**: [`ToxicType`](/libraries/common-testing/TPClient.TypeAlias.ToxicType.md)

Toxic type

#### Inherited from

`IToxicBody.type`
