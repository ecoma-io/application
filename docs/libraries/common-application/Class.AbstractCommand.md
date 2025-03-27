# Class: `abstract` AbstractCommand

class BaseCommand

## Description

Lớp cơ sở trừu tượng triển khai các thuộc tính chung của ICommand.
Các Command cụ thể nên kế thừa lớp này.

## Implements

- [`ICommand`](/libraries/common-application/Interface.ICommand.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new AbstractCommand**(`props`): `AbstractCommand`

#### Parameters

##### props

Các thuộc tính của Command.

###### language

`string`

Ngôn ngữ của command.

###### traceId?

`string`

ID truy vết.

###### version

`string`

Phiên bản của command.

#### Returns

`AbstractCommand`

## Properties

<a id="language"></a>

### language?

> `readonly` `optional` **language**: `string`

#### Description

Ngôn ngữ của command.

#### Implementation of

[`ICommand`](/libraries/common-application/Interface.ICommand.md).[`language`](/libraries/common-application/Interface.ICommand.md#language)

***

<a id="traceid"></a>

### traceId?

> `readonly` `optional` **traceId**: `string`

#### Description

ID truy vết cho luồng xử lý này (correlation ID).
Giúp theo dõi yêu cầu qua nhiều service.

#### Implementation of

[`ICommand`](/libraries/common-application/Interface.ICommand.md).[`traceId`](/libraries/common-application/Interface.ICommand.md#traceid)

***

<a id="version"></a>

### version

> `readonly` **version**: `string`

#### Description

Phiên bản của command.

#### Implementation of

[`ICommand`](/libraries/common-application/Interface.ICommand.md).[`version`](/libraries/common-application/Interface.ICommand.md#version)
