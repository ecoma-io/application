# Interface: IApplicationService

## Methods

<a id="execute"></a>

### execute()

> **execute**\<`TCommand`, `TResult`\>(`command`): `Awaitable`\<`TResult`\>

#### Type Parameters

##### TCommand

`TCommand` *extends* [`ICommand`](/libraries/common-application/Interface.ICommand.md)

##### TResult

`TResult`

#### Parameters

##### command

`TCommand`

Lệnh cần thực hiện.

#### Returns

`Awaitable`\<`TResult`\>

Kết quả của lệnh.

#### Description

Gửi một lệnh để thực hiện một hành động.
