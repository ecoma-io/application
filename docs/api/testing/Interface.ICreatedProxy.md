# Interface: ICreatedProxy

Interface mô tả một proxy đã được tạo

## Properties

<a id="host"></a>

### host

> **host**: `string`

Host của proxy

***

<a id="instance"></a>

### instance

> **instance**: [`Proxy`](/api/testing/TPClient.Class.Proxy.md)

Instance của proxy

***

<a id="port"></a>

### port

> **port**: `number`

Cổng của proxy

***

<a id="setenabled"></a>

### setEnabled()

> **setEnabled**: (`enabled`) => `Promise`\<[`Proxy`](/api/testing/TPClient.Class.Proxy.md)\>

Hàm để bật/tắt proxy

#### Parameters

##### enabled

`boolean`

Trạng thái bật/tắt

#### Returns

`Promise`\<[`Proxy`](/api/testing/TPClient.Class.Proxy.md)\>

Promise với instance proxy đã được cập nhật
