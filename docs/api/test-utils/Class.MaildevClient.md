# Class: MaildevClient

Client for interacting with Maildev API

## Constructors

<a id="constructor"></a>

### Constructor

> **new MaildevClient**(`baseApiUrl`): `MaildevClient`

Creates a new MaildevClient instance

#### Parameters

##### baseApiUrl

`string`

Base URL of the Maildev API

#### Returns

`MaildevClient`

## Methods

<a id="getemail"></a>

### getEmail()

> **getEmail**(`address`): `Promise`\<[`IMail`](/api/test-utils/Interface.IMail.md)[]\>

Retrieves emails sent to a specific address and deletes the first one found

#### Parameters

##### address

`string`

Email address to search for

#### Returns

`Promise`\<[`IMail`](/api/test-utils/Interface.IMail.md)[]\>

Promise resolving to an array of matching emails
