# Interface: IQueryHandler\<TQuery, TResult\>

Interface cho một query handler

## Type Parameters

### TQuery

`TQuery` _extends_ [`IQuery`](/libraries/common-application/Interface.IQuery.md)

### TResult

`TResult` = `void`

## Methods

<a id="handle"></a>

### handle()

> **handle**(`query`): `Awaitable`\<`TResult`\>

#### Parameters

##### query

`TQuery`

#### Returns

`Awaitable`\<`TResult`\>
