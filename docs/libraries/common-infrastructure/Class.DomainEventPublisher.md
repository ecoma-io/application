# Class: DomainEventPublisher

Publisher cho domain events

## Constructors

<a id="constructor"></a>

### Constructor

> **new DomainEventPublisher**(`amqpConnection`): `DomainEventPublisher`

#### Parameters

##### amqpConnection

`AmqpConnection`

#### Returns

`DomainEventPublisher`

## Methods

<a id="publish"></a>

### publish()

> **publish**(`event`): `Promise`\<`void`\>

Publish một domain event

#### Parameters

##### event

`AbstractDomainEvent`

Event cần publish

#### Returns

`Promise`\<`void`\>

***

<a id="publishall"></a>

### publishAll()

> **publishAll**(`events`): `Promise`\<`void`\>

Publish nhiều domain events cùng lúc

#### Parameters

##### events

`AbstractDomainEvent`[]

Danh sách events cần publish

#### Returns

`Promise`\<`void`\>
