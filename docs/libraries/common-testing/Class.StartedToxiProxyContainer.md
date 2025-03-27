# Class: StartedToxiProxyContainer

Container ToxiProxy đã được khởi động

## Extends

- `AbstractStartedContainer`

## Constructors

<a id="constructor"></a>

### Constructor

> **new StartedToxiProxyContainer**(`startedTestContainer`): `StartedToxiProxyContainer`

Khởi tạo một StartedToxiProxyContainer

#### Parameters

##### startedTestContainer

`StartedTestContainer`

Container đã được khởi động

#### Returns

`StartedToxiProxyContainer`

#### Overrides

`AbstractStartedContainer.constructor`

## Properties

<a id="client"></a>

### client

> `readonly` **client**: [`Toxiproxy`](/libraries/common-testing/TPClient.Class.Toxiproxy.md)

Client để tương tác với ToxiProxy

***

<a id="startedtestcontainer"></a>

### startedTestContainer

> `protected` `readonly` **startedTestContainer**: `StartedTestContainer`

#### Inherited from

`AbstractStartedContainer.startedTestContainer`

## Methods

<a id="commit"></a>

### commit()

> **commit**(`options`): `Promise`\<`string`\>

#### Parameters

##### options

`CommitOptions`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`AbstractStartedContainer.commit`

***

<a id="containerstopped"></a>

### containerStopped()?

> `protected` `optional` **containerStopped**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.containerStopped`

***

<a id="containerstopping"></a>

### containerStopping()?

> `protected` `optional` **containerStopping**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.containerStopping`

***

<a id="copyarchivefromcontainer"></a>

### copyArchiveFromContainer()

> **copyArchiveFromContainer**(`path`): `Promise`\<`ReadableStream`\>

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`ReadableStream`\>

#### Inherited from

`AbstractStartedContainer.copyArchiveFromContainer`

***

<a id="copyarchivetocontainer"></a>

### copyArchiveToContainer()

> **copyArchiveToContainer**(`tar`, `target?`): `Promise`\<`void`\>

#### Parameters

##### tar

`Readable`

##### target?

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.copyArchiveToContainer`

***

<a id="copycontenttocontainer"></a>

### copyContentToContainer()

> **copyContentToContainer**(`contentsToCopy`): `Promise`\<`void`\>

#### Parameters

##### contentsToCopy

`ContentToCopy`[]

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.copyContentToContainer`

***

<a id="copydirectoriestocontainer"></a>

### copyDirectoriesToContainer()

> **copyDirectoriesToContainer**(`directoriesToCopy`): `Promise`\<`void`\>

#### Parameters

##### directoriesToCopy

`FileToCopy`[]

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.copyDirectoriesToContainer`

***

<a id="copyfilestocontainer"></a>

### copyFilesToContainer()

> **copyFilesToContainer**(`filesToCopy`): `Promise`\<`void`\>

#### Parameters

##### filesToCopy

`FileToCopy`[]

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.copyFilesToContainer`

***

<a id="createproxy"></a>

### createProxy()

> **createProxy**(`createProxyBody`): `Promise`\<[`ICreatedProxy`](/libraries/common-testing/Interface.ICreatedProxy.md)\>

Tạo một proxy mới

#### Parameters

##### createProxyBody

`Omit`\<[`ICreateProxyBody`](/libraries/common-testing/TPClient.Interface.ICreateProxyBody.md), `"listen"`\>

Thông tin cấu hình proxy

#### Returns

`Promise`\<[`ICreatedProxy`](/libraries/common-testing/Interface.ICreatedProxy.md)\>

Promise với thông tin proxy đã được tạo

#### Throws

Error khi không còn cổng khả dụng

***

<a id="exec"></a>

### exec()

> **exec**(`command`, `opts?`): `Promise`\<`ExecResult`\>

#### Parameters

##### command

`string` | `string`[]

##### opts?

`Partial`\<`ExecOptions`\>

#### Returns

`Promise`\<`ExecResult`\>

#### Inherited from

`AbstractStartedContainer.exec`

***

<a id="getfirstmappedport"></a>

### getFirstMappedPort()

> **getFirstMappedPort**(): `number`

#### Returns

`number`

#### Inherited from

`AbstractStartedContainer.getFirstMappedPort`

***

<a id="gethost"></a>

### getHost()

> **getHost**(): `string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getHost`

***

<a id="gethostname"></a>

### getHostname()

> **getHostname**(): `string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getHostname`

***

<a id="getid"></a>

### getId()

> **getId**(): `string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getId`

***

<a id="getipaddress"></a>

### getIpAddress()

> **getIpAddress**(`networkName`): `string`

#### Parameters

##### networkName

`string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getIpAddress`

***

<a id="getlabels"></a>

### getLabels()

> **getLabels**(): `Labels`

#### Returns

`Labels`

#### Inherited from

`AbstractStartedContainer.getLabels`

***

<a id="getmappedport"></a>

### getMappedPort()

> **getMappedPort**(`port`): `number`

#### Parameters

##### port

`number`

#### Returns

`number`

#### Inherited from

`AbstractStartedContainer.getMappedPort`

***

<a id="getname"></a>

### getName()

> **getName**(): `string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getName`

***

<a id="getnetworkid"></a>

### getNetworkId()

> **getNetworkId**(`networkName`): `string`

#### Parameters

##### networkName

`string`

#### Returns

`string`

#### Inherited from

`AbstractStartedContainer.getNetworkId`

***

<a id="getnetworknames"></a>

### getNetworkNames()

> **getNetworkNames**(): `string`[]

#### Returns

`string`[]

#### Inherited from

`AbstractStartedContainer.getNetworkNames`

***

<a id="logs"></a>

### logs()

> **logs**(`opts?`): `Promise`\<`Readable`\>

#### Parameters

##### opts?

###### since?

`number`

###### tail?

`number`

#### Returns

`Promise`\<`Readable`\>

#### Inherited from

`AbstractStartedContainer.logs`

***

<a id="restart"></a>

### restart()

> **restart**(`options?`): `Promise`\<`void`\>

#### Parameters

##### options?

`Partial`\<`RestartOptions`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractStartedContainer.restart`

***

<a id="stop"></a>

### stop()

> **stop**(`options?`): `Promise`\<`StoppedTestContainer`\>

#### Parameters

##### options?

`Partial`\<`StopOptions`\>

#### Returns

`Promise`\<`StoppedTestContainer`\>

#### Inherited from

`AbstractStartedContainer.stop`
