# Class: Domains

Service for managing domain-related operations and URL generation
Handles both browser and server-side environments

## Constructors

<a id="constructor"></a>

### Constructor

> **new Domains**(`platformId`, `document`, `request`): `Domains`

Creates an instance of Domains service

#### Parameters

##### platformId

`object`

The platform ID to determine execution environment

##### document

`Document`

The document object for browser environment

##### request

`Request`

Optional Express Request object for server environment

#### Returns

`Domains`

#### Throws

Error if REQUEST_TOKEN is not provided in server-side environment

## Methods

<a id="getaccountssitebaseurl"></a>

### getAccountsSiteBaseUrl()

> **getAccountsSiteBaseUrl**(): `string`

Gets the base URL for the accounts site

#### Returns

`string`

The complete accounts site URL (e.g., 'https://accounts.example.com')

***

<a id="getadminsitebaseurl"></a>

### getAdminSiteBaseUrl()

> **getAdminSiteBaseUrl**(): `string`

Gets the base URL for the admin site

#### Returns

`string`

The complete admin site URL (e.g., 'https://admin.example.com')

***

<a id="gethomesitebaseurl"></a>

### getHomeSiteBaseUrl()

> **getHomeSiteBaseUrl**(): `string`

Gets the base URL for the home site

#### Returns

`string`

The complete home site URL (e.g., 'https://example.com')

***

<a id="getiamservicebaseurl"></a>

### getIamServiceBaseUrl()

> **getIamServiceBaseUrl**(): `string`

Gets the base URL for the IAM service

#### Returns

`string`

The complete IAM service URL (e.g., 'https://iam.example.com')

***

<a id="geticonsbaseurl"></a>

### getIconsBaseUrl()

> **getIconsBaseUrl**(): `string`

Gets the base URL for the icons

#### Returns

`string`

The complete admin site URL (e.g., 'https://icons.example.com')

***

<a id="getndmservicebaseurl"></a>

### getNdmServiceBaseUrl()

> **getNdmServiceBaseUrl**(): `string`

Gets the base URL for the NDM service

#### Returns

`string`

The complete NDM service URL (e.g., 'https://ndm.example.com')

***

<a id="getprotocol"></a>

### getProtocol()

> **getProtocol**(): `undefined` \| `string`

Gets the current protocol

#### Returns

`undefined` \| `string`

The current protocol (e.g., 'https:', 'http:')

***

<a id="getrootdomain"></a>

### getRootDomain()

> **getRootDomain**(): `string`

Gets the root domain from the current hostname

#### Returns

`string`

The root domain (e.g., 'example.com' from 'www.example.com')

#### Example

```ts
// Returns 'example.com'
getRootDomain('www.example.com')
// Returns 'co.uk'
getRootDomain('sub.domain.co.uk')
```
