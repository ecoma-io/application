# Class: `abstract` AbstractQuery

class BaseQuery

## Description

Lớp cơ sở trừu tượng triển khai các thuộc tính chung của IQuery.
Các Query cụ thể nên kế thừa lớp này.

## Implements

- [`IQuery`](/libraries/common-application/Interface.IQuery.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractQuery**(`props`): `AbstractQuery`

#### Parameters

##### props

Các thuộc tính của Query.

###### language

`string`

Ngôn ngữ của query.

###### traceId?

`string`

ID truy vết.

###### version

`string`

Phiên bản của query.

#### Returns

`AbstractQuery`

## Properties

<a id="language"></a>

### language

> `readonly` **language**: `string`

#### Description

Ngôn ngữ của command.

#### Implementation of

[`IQuery`](/libraries/common-application/Interface.IQuery.md).[`language`](/libraries/common-application/Interface.IQuery.md#language)

***

<a id="traceid"></a>

### traceId?

> `readonly` `optional` **traceId**: `string`

#### Description

ID truy vết cho luồng xử lý này (correlation ID).
Giúp theo dõi yêu cầu qua nhiều service.

#### Implementation of

[`IQuery`](/libraries/common-application/Interface.IQuery.md).[`traceId`](/libraries/common-application/Interface.IQuery.md#traceid)

***

<a id="version"></a>

### version

> `readonly` **version**: `string`

#### Description

Phiên bản của command.

#### Implementation of

[`IQuery`](/libraries/common-application/Interface.IQuery.md).[`version`](/libraries/common-application/Interface.IQuery.md#version)
