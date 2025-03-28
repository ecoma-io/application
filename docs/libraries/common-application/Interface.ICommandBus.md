# Interface: ICommandBus

Interface định nghĩa contract cho Command Bus
Command Bus chịu trách nhiệm gửi command đến command handler tương ứng

## Methods

<a id="execute"></a>

### execute()

> **execute**\<`TCommand`, `TResult`\>(`command`): `Awaitable`\<`TResult`\>

Thực thi một command

#### Type Parameters

##### TCommand

`TCommand` *extends* [`ICommand`](/libraries/common-application/Interface.ICommand.md)

##### TResult

`TResult` = `void`

#### Parameters

##### command

`TCommand`

Command cần thực thi

#### Returns

`Awaitable`\<`TResult`\>

Awaitable<TResult> chứa kết quả từ command handler

#### Throws

Nếu không tìm thấy handler cho command

***

<a id="register"></a>

### register()

> **register**\<`TCommand`, `TResult`\>(`commandType`, `handler`): `void`

Đăng ký command handler cho một loại command cụ thể

#### Type Parameters

##### TCommand

`TCommand` *extends* [`ICommand`](/libraries/common-application/Interface.ICommand.md)

##### TResult

`TResult` = `void`

#### Parameters

##### commandType

(...`args`) => `TCommand`

Loại command cần đăng ký handler

##### handler

[`ICommandHandler`](/libraries/common-application/Interface.ICommandHandler.md)\<`TCommand`, `TResult`\>

Command handler xử lý command

#### Returns

`void`

#### Throws

Nếu đã có handler được đăng ký cho command này
