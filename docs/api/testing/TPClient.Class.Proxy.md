# Class: Proxy

## Constructors

<a id="constructor"></a>

### Constructor

> **new Proxy**(`toxiproxy`, `body`): `Proxy`

#### Parameters

##### toxiproxy

[`Toxiproxy`](/api/testing/TPClient.Class.Toxiproxy.md)

##### body

`ICreateProxyResponse` | `IGetProxyResponse`

#### Returns

`Proxy`

## Properties

<a id="api"></a>

### api

> `readonly` **api**: `AxiosInstance`

***

<a id="enabled"></a>

### enabled

> `readonly` **enabled**: `boolean`

***

<a id="listen"></a>

### listen

> `readonly` **listen**: `string`

***

<a id="name"></a>

### name

> `readonly` **name**: `string`

***

<a id="toxiproxy"></a>

### toxiproxy

> `readonly` **toxiproxy**: [`Toxiproxy`](/api/testing/TPClient.Class.Toxiproxy.md)

***

<a id="upstream"></a>

### upstream

> `readonly` **upstream**: `string`

## Methods

<a id="addtoxic"></a>

### addToxic()

> **addToxic**\<`T`\>(`body`): `Promise`\<[`Toxic`](/api/testing/TPClient.Class.Toxic.md)\<`T`\>\>

Adds a new toxic to the proxy.

#### Type Parameters

##### T

`T`

#### Parameters

##### body

[`ICreateToxicBody`](/api/testing/TPClient.Interface.ICreateToxicBody.md)\<`T`\>

toxic attributes

#### Returns

`Promise`\<[`Toxic`](/api/testing/TPClient.Class.Toxic.md)\<`T`\>\>

toxic

***

<a id="gethost"></a>

### getHost()

> **getHost**(): `string`

#### Returns

`string`

***

<a id="getpath"></a>

### getPath()

> **getPath**(): `string`

#### Returns

`string`

***

<a id="gettoxic"></a>

### getToxic()

> **getToxic**\<`T`\>(`name`): `Promise`\<[`Toxic`](/api/testing/TPClient.Class.Toxic.md)\<`T`\>\>

Gets the toxic from the proxy.

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

toxic name

#### Returns

`Promise`\<[`Toxic`](/api/testing/TPClient.Class.Toxic.md)\<`T`\>\>

toxic

***

<a id="gettoxiproxy"></a>

### getToxiproxy()

> **getToxiproxy**(): [`Toxiproxy`](/api/testing/TPClient.Class.Toxiproxy.md)

#### Returns

[`Toxiproxy`](/api/testing/TPClient.Class.Toxiproxy.md)

***

<a id="remove"></a>

### remove()

> **remove**(): `Promise`\<`void`\>

Deletes the proxy from the server.

#### Returns

`Promise`\<`void`\>

***

<a id="tojson"></a>

### toJson()

> **toJson**(): `ProxyJson`

#### Returns

`ProxyJson`

***

<a id="update"></a>

### update()

> **update**(`body`): `Promise`\<`Proxy`\>

Updates the existing proxy on the server (e.g. disable an enabled proxy).

#### Parameters

##### body

`IUpdateProxyBody`

#### Returns

`Promise`\<`Proxy`\>

updated proxy
