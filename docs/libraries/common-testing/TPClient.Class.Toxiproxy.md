# Class: Toxiproxy

## Constructors

<a id="constructor"></a>

### Constructor

> **new Toxiproxy**(`host`): `Toxiproxy`

#### Parameters

##### host

`string`

#### Returns

`Toxiproxy`

## Properties

<a id="api"></a>

### api

> **api**: `AxiosInstance`

***

<a id="host"></a>

### host

> **host**: `string`

## Methods

<a id="createproxy"></a>

### createProxy()

> **createProxy**(`body`): `Promise`\<[`Proxy`](/libraries/common-testing/TPClient.Class.Proxy.md)\>

#### Parameters

##### body

[`ICreateProxyBody`](/libraries/common-testing/TPClient.Interface.ICreateProxyBody.md)

#### Returns

`Promise`\<[`Proxy`](/libraries/common-testing/TPClient.Class.Proxy.md)\>

***

<a id="get"></a>

### get()

> **get**(`name`): `Promise`\<[`Proxy`](/libraries/common-testing/TPClient.Class.Proxy.md)\>

#### Parameters

##### name

`string`

#### Returns

`Promise`\<[`Proxy`](/libraries/common-testing/TPClient.Class.Proxy.md)\>

***

<a id="getall"></a>

### getAll()

> **getAll**(): `Promise`\<`Proxies`\>

#### Returns

`Promise`\<`Proxies`\>

***

<a id="getapi"></a>

### getApi()

> **getApi**(): `AxiosInstance`

#### Returns

`AxiosInstance`

***

<a id="getversion"></a>

### getVersion()

> **getVersion**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

***

<a id="populate"></a>

### populate()

> **populate**(`body`): `Promise`\<`Proxies`\>

#### Parameters

##### body

`IPopulateProxiesBody`

#### Returns

`Promise`\<`Proxies`\>

***

<a id="reset"></a>

### reset()

> **reset**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>
