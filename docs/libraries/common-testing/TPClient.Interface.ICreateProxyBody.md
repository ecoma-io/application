# Interface: ICreateProxyBody

## Extends

- `IProxyBody`

## Properties

<a id="enabled"></a>

### enabled?

> `optional` **enabled**: `boolean`

true/false (defaults to true on creation)

#### Inherited from

`IProxyBody.enabled`

***

<a id="listen"></a>

### listen

> **listen**: `string`

listen address (localhost or IP address:port)

Example: "localhost:12345" will open a proxy on localhost, port 12345

#### Inherited from

`IProxyBody.listen`

***

<a id="name"></a>

### name

> **name**: `string`

proxy name

#### Inherited from

`IProxyBody.name`

***

<a id="upstream"></a>

### upstream

> **upstream**: `string`

proxy upstream address (dns name or IP:port)

Example: "mongodb:27017" will proxy to a mongodb instance running on mongodb host at port 27017

#### Inherited from

`IProxyBody.upstream`
