# Interface: ICommandHandler\<TCommand, TResult\>

ICommandHandler

## Description

Định nghĩa hợp đồng cho các lớp xử lý Command.
Mỗi Command Handler chịu trách nhiệm xử lý một loại Command cụ thể.

## Type Parameters

### TCommand

`TCommand` *extends* [`ICommand`](/libraries/common-application/Interface.ICommand.md)

Loại Command mà Handler này xử lý (phải kế thừa ICommand).

### TResult

`TResult` = `void` \| [`IGenericResult`](/libraries/common-application/Interface.IGenericResult.md)\<`unknown`\>

Loại kết quả trả về sau khi xử lý Command (có thể là void hoặc một DTO).

## Methods

<a id="handle"></a>

### handle()

> **handle**(`command`): `Awaitable`\<`TResult`\>

#### Parameters

##### command

`TCommand`

Instance của Command cần xử lý.

#### Returns

`Awaitable`\<`TResult`\>

Kết quả của quá trình xử lý (có thể là Promise).

#### Method

handle

#### Description

Phương thức xử lý Command.
