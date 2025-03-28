# Class: CommandPublisher

Publisher cho commands

## Constructors

<a id="constructor"></a>

### Constructor

> **new CommandPublisher**(`amqpConnection`): `CommandPublisher`

#### Parameters

##### amqpConnection

`AmqpConnection`

#### Returns

`CommandPublisher`

## Methods

<a id="publish"></a>

### publish()

> **publish**(`queue`, `command`): `Promise`\<`void`\>

Publish một command

#### Parameters

##### queue

`string`

Queue để gửi command

##### command

`unknown`

Command cần gửi

#### Returns

`Promise`\<`void`\>
