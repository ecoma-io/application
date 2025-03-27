# Class: `abstract` AbstractAggregateFactory\<TId, TProps, TAggregate\>

## Type Parameters

### TId

`TId` _extends_ `AbstractId`

### TProps

`TProps` _extends_ `IEntityProps`\<`TId`\>

### TAggregate

`TAggregate` _extends_ `AbstractAggregate`\<`TId`, `TProps`\>

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractAggregateFactory**\<`TId`, `TProps`, `TAggregate`\>(): `AbstractAggregateFactory`\<`TId`, `TProps`, `TAggregate`\>

#### Returns

`AbstractAggregateFactory`\<`TId`, `TProps`, `TAggregate`\>

## Methods

<a id="create"></a>

### create()

> `abstract` **create**(`props`): `TAggregate`

#### Parameters

##### props

`Omit`\<`TProps`, `"id"`\>

#### Returns

`TAggregate`
