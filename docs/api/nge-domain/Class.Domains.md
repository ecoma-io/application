# Class: Domains

## Constructors

<a id="constructor"></a>

### Constructor

> **new Domains**(`platformId`, `document`, `request`): `Domains`

#### Parameters

##### platformId

`object`

##### document

`Document`

##### request

`Request`

#### Returns

`Domains`

## Methods

<a id="getprotocol"></a>

### getProtocol()

> **getProtocol**(): `undefined` \| `string`

Trả về protocol hiện tại (e.g., 'https:', 'http:')

#### Returns

`undefined` \| `string`

---

<a id="getrootdomain"></a>

### getRootDomain()

> **getRootDomain**(): `undefined` \| `string`

Trả về root domain (tên miền cấp 1)
Ví dụ: từ 'www.example.com' sẽ trả về 'example.com'
Ví dụ: từ 'sub.domain.co.uk' sẽ trả về 'domain.co.uk'

#### Returns

`undefined` \| `string`
