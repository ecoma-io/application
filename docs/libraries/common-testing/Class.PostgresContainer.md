# Class: PostgresContainer

Container PostgreSQL dùng cho integration test.

## Since

1.0.0

## Extends

- `GenericContainer`

## Constructors

<a id="constructor"></a>

### Constructor

> **new PostgresContainer**(`image`, `password`, `user`, `db`): `PostgresContainer`

#### Parameters

##### image

`string` = `"postgres:15-alpine"`

##### password

`string` = `"test"`

##### user

`string` = `"test"`

##### db

`string` = `"test"`

#### Returns

`PostgresContainer`

#### Overrides

`GenericContainer.constructor`

## Properties

<a id="archivestocopy"></a>

### archivesToCopy

> `protected` **archivesToCopy**: `ArchiveToCopy`[]

#### Inherited from

`GenericContainer.archivesToCopy`

***

<a id="autoremove"></a>

### autoRemove

> `protected` **autoRemove**: `boolean`

#### Inherited from

`GenericContainer.autoRemove`

***

<a id="contentstocopy"></a>

### contentsToCopy

> `protected` **contentsToCopy**: `ContentToCopy`[]

#### Inherited from

`GenericContainer.contentsToCopy`

***

<a id="createopts"></a>

### createOpts

> `protected` **createOpts**: `ContainerCreateOptions`

#### Inherited from

`GenericContainer.createOpts`

***

<a id="directoriestocopy"></a>

### directoriesToCopy

> `protected` **directoriesToCopy**: `FileToCopy`[]

#### Inherited from

`GenericContainer.directoriesToCopy`

***

<a id="environment"></a>

### environment

> `protected` **environment**: `Record`\<`string`, `string`\>

#### Inherited from

`GenericContainer.environment`

***

<a id="exposedports"></a>

### exposedPorts

> `protected` **exposedPorts**: `PortWithOptionalBinding`[]

#### Inherited from

`GenericContainer.exposedPorts`

***

<a id="filestocopy"></a>

### filesToCopy

> `protected` **filesToCopy**: `FileToCopy`[]

#### Inherited from

`GenericContainer.filesToCopy`

***

<a id="healthcheck"></a>

### healthCheck?

> `protected` `optional` **healthCheck**: `HealthCheck`

#### Inherited from

`GenericContainer.healthCheck`

***

<a id="hostconfig"></a>

### hostConfig

> `protected` **hostConfig**: `HostConfig`

#### Inherited from

`GenericContainer.hostConfig`

***

<a id="imagename"></a>

### imageName

> `protected` **imageName**: `ImageName`

#### Inherited from

`GenericContainer.imageName`

***

<a id="logconsumer"></a>

### logConsumer()?

> `protected` `optional` **logConsumer**: (`stream`) => `unknown`

#### Parameters

##### stream

`Readable`

#### Returns

`unknown`

#### Inherited from

`GenericContainer.logConsumer`

***

<a id="networkaliases"></a>

### networkAliases

> `protected` **networkAliases**: `string`[]

#### Inherited from

`GenericContainer.networkAliases`

***

<a id="networkmode"></a>

### networkMode?

> `protected` `optional` **networkMode**: `string`

#### Inherited from

`GenericContainer.networkMode`

***

<a id="pullpolicy"></a>

### pullPolicy

> `protected` **pullPolicy**: `ImagePullPolicy`

#### Inherited from

`GenericContainer.pullPolicy`

***

<a id="reuse"></a>

### reuse

> `protected` **reuse**: `boolean`

#### Inherited from

`GenericContainer.reuse`

***

<a id="startuptimeout"></a>

### startupTimeout?

> `protected` `optional` **startupTimeout**: `number`

#### Inherited from

`GenericContainer.startupTimeout`

***

<a id="waitstrategy"></a>

### waitStrategy

> `protected` **waitStrategy**: `WaitStrategy`

#### Inherited from

`GenericContainer.waitStrategy`

## Methods

<a id="beforecontainercreated"></a>

### beforeContainerCreated()?

> `protected` `optional` **beforeContainerCreated**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`GenericContainer.beforeContainerCreated`

***

<a id="containercreated"></a>

### containerCreated()?

> `protected` `optional` **containerCreated**(`containerId`): `Promise`\<`void`\>

#### Parameters

##### containerId

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`GenericContainer.containerCreated`

***

<a id="containerstarted"></a>

### containerStarted()?

> `protected` `optional` **containerStarted**(`container`, `inspectResult`, `reused`): `Promise`\<`void`\>

#### Parameters

##### container

`StartedTestContainer`

##### inspectResult

`InspectResult`

##### reused

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`GenericContainer.containerStarted`

***

<a id="containerstarting"></a>

### containerStarting()?

> `protected` `optional` **containerStarting**(`inspectResult`, `reused`): `Promise`\<`void`\>

#### Parameters

##### inspectResult

`InspectResult`

##### reused

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`GenericContainer.containerStarting`

***

<a id="start"></a>

### start()

> **start**(): `Promise`\<[`StartedPostgresContainer`](/libraries/common-testing/Class.StartedPostgresContainer.md)\>

Khởi động container và trả về instance StartedPostgresContainer

#### Returns

`Promise`\<[`StartedPostgresContainer`](/libraries/common-testing/Class.StartedPostgresContainer.md)\>

#### Overrides

`GenericContainer.start`

***

<a id="stop"></a>

### stop()

> **stop**(): `Promise`\<`void`\>

Dừng container sau khi sử dụng

#### Returns

`Promise`\<`void`\>

***

<a id="withaddedcapabilities"></a>

### withAddedCapabilities()

> **withAddedCapabilities**(...`capabilities`): `this`

#### Parameters

##### capabilities

...`string`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withAddedCapabilities`

***

<a id="withautoremove"></a>

### withAutoRemove()

> **withAutoRemove**(`autoRemove`): `this`

#### Parameters

##### autoRemove

`boolean`

#### Returns

`this`

#### Inherited from

`GenericContainer.withAutoRemove`

***

<a id="withbindmounts"></a>

### withBindMounts()

> **withBindMounts**(`bindMounts`): `this`

#### Parameters

##### bindMounts

`BindMount`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withBindMounts`

***

<a id="withcommand"></a>

### withCommand()

> **withCommand**(`command`): `this`

#### Parameters

##### command

`string`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withCommand`

***

<a id="withcopyarchivestocontainer"></a>

### withCopyArchivesToContainer()

> **withCopyArchivesToContainer**(`archivesToCopy`): `this`

#### Parameters

##### archivesToCopy

`ArchiveToCopy`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withCopyArchivesToContainer`

***

<a id="withcopycontenttocontainer"></a>

### withCopyContentToContainer()

> **withCopyContentToContainer**(`contentsToCopy`): `this`

#### Parameters

##### contentsToCopy

`ContentToCopy`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withCopyContentToContainer`

***

<a id="withcopydirectoriestocontainer"></a>

### withCopyDirectoriesToContainer()

> **withCopyDirectoriesToContainer**(`directoriesToCopy`): `this`

#### Parameters

##### directoriesToCopy

`FileToCopy`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withCopyDirectoriesToContainer`

***

<a id="withcopyfilestocontainer"></a>

### withCopyFilesToContainer()

> **withCopyFilesToContainer**(`filesToCopy`): `this`

#### Parameters

##### filesToCopy

`FileToCopy`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withCopyFilesToContainer`

***

<a id="withdefaultlogdriver"></a>

### withDefaultLogDriver()

> **withDefaultLogDriver**(): `this`

#### Returns

`this`

#### Inherited from

`GenericContainer.withDefaultLogDriver`

***

<a id="withdroppedcapabilities"></a>

### withDroppedCapabilities()

> **withDroppedCapabilities**(...`capabilities`): `this`

#### Parameters

##### capabilities

...`string`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withDroppedCapabilities`

***

<a id="withentrypoint"></a>

### withEntrypoint()

> **withEntrypoint**(`entrypoint`): `this`

#### Parameters

##### entrypoint

`string`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withEntrypoint`

***

<a id="withenvironment"></a>

### withEnvironment()

> **withEnvironment**(`environment`): `this`

#### Parameters

##### environment

`Environment`

#### Returns

`this`

#### Inherited from

`GenericContainer.withEnvironment`

***

<a id="withexposedports"></a>

### withExposedPorts()

> **withExposedPorts**(...`ports`): `this`

#### Parameters

##### ports

...`PortWithOptionalBinding`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withExposedPorts`

***

<a id="withextrahosts"></a>

### withExtraHosts()

> **withExtraHosts**(`extraHosts`): `this`

#### Parameters

##### extraHosts

`ExtraHost`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withExtraHosts`

***

<a id="withhealthcheck"></a>

### withHealthCheck()

> **withHealthCheck**(`healthCheck`): `this`

#### Parameters

##### healthCheck

`HealthCheck`

#### Returns

`this`

#### Inherited from

`GenericContainer.withHealthCheck`

***

<a id="withhostname"></a>

### withHostname()

> **withHostname**(`hostname`): `this`

#### Parameters

##### hostname

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withHostname`

***

<a id="withipcmode"></a>

### withIpcMode()

> **withIpcMode**(`ipcMode`): `this`

#### Parameters

##### ipcMode

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withIpcMode`

***

<a id="withlabels"></a>

### withLabels()

> **withLabels**(`labels`): `this`

#### Parameters

##### labels

`Labels`

#### Returns

`this`

#### Inherited from

`GenericContainer.withLabels`

***

<a id="withlogconsumer"></a>

### withLogConsumer()

> **withLogConsumer**(`logConsumer`): `this`

#### Parameters

##### logConsumer

(`stream`) => `unknown`

#### Returns

`this`

#### Inherited from

`GenericContainer.withLogConsumer`

***

<a id="withname"></a>

### withName()

> **withName**(`name`): `this`

#### Parameters

##### name

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withName`

***

<a id="withnetwork"></a>

### withNetwork()

> **withNetwork**(`network`): `this`

#### Parameters

##### network

`StartedNetwork`

#### Returns

`this`

#### Inherited from

`GenericContainer.withNetwork`

***

<a id="withnetworkaliases"></a>

### withNetworkAliases()

> **withNetworkAliases**(...`networkAliases`): `this`

#### Parameters

##### networkAliases

...`string`[]

#### Returns

`this`

#### Inherited from

`GenericContainer.withNetworkAliases`

***

<a id="withnetworkmode"></a>

### withNetworkMode()

> **withNetworkMode**(`networkMode`): `this`

#### Parameters

##### networkMode

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withNetworkMode`

***

<a id="withplatform"></a>

### withPlatform()

> **withPlatform**(`platform`): `this`

#### Parameters

##### platform

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withPlatform`

***

<a id="withprivilegedmode"></a>

### withPrivilegedMode()

> **withPrivilegedMode**(): `this`

#### Returns

`this`

#### Inherited from

`GenericContainer.withPrivilegedMode`

***

<a id="withpullpolicy"></a>

### withPullPolicy()

> **withPullPolicy**(`pullPolicy`): `this`

#### Parameters

##### pullPolicy

`ImagePullPolicy`

#### Returns

`this`

#### Inherited from

`GenericContainer.withPullPolicy`

***

<a id="withresourcesquota"></a>

### withResourcesQuota()

> **withResourcesQuota**(`__namedParameters`): `this`

#### Parameters

##### \_\_namedParameters

`ResourcesQuota`

#### Returns

`this`

#### Inherited from

`GenericContainer.withResourcesQuota`

***

<a id="withreuse"></a>

### withReuse()

> **withReuse**(): `this`

#### Returns

`this`

#### Inherited from

`GenericContainer.withReuse`

***

<a id="withsharedmemorysize"></a>

### withSharedMemorySize()

> **withSharedMemorySize**(`bytes`): `this`

#### Parameters

##### bytes

`number`

#### Returns

`this`

#### Inherited from

`GenericContainer.withSharedMemorySize`

***

<a id="withstartuptimeout"></a>

### withStartupTimeout()

> **withStartupTimeout**(`startupTimeoutMs`): `this`

#### Parameters

##### startupTimeoutMs

`number`

#### Returns

`this`

#### Inherited from

`GenericContainer.withStartupTimeout`

***

<a id="withtmpfs"></a>

### withTmpFs()

> **withTmpFs**(`tmpFs`): `this`

#### Parameters

##### tmpFs

`TmpFs`

#### Returns

`this`

#### Inherited from

`GenericContainer.withTmpFs`

***

<a id="withulimits"></a>

### withUlimits()

> **withUlimits**(`ulimits`): `this`

#### Parameters

##### ulimits

`Ulimits`

#### Returns

`this`

#### Inherited from

`GenericContainer.withUlimits`

***

<a id="withuser"></a>

### withUser()

> **withUser**(`user`): `this`

#### Parameters

##### user

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withUser`

***

<a id="withwaitstrategy"></a>

### withWaitStrategy()

> **withWaitStrategy**(`waitStrategy`): `this`

#### Parameters

##### waitStrategy

`WaitStrategy`

#### Returns

`this`

#### Inherited from

`GenericContainer.withWaitStrategy`

***

<a id="withworkingdir"></a>

### withWorkingDir()

> **withWorkingDir**(`workingDir`): `this`

#### Parameters

##### workingDir

`string`

#### Returns

`this`

#### Inherited from

`GenericContainer.withWorkingDir`

***

<a id="fromdockerfile"></a>

### fromDockerfile()

> `static` **fromDockerfile**(`context`, `dockerfileName?`): `GenericContainerBuilder`

#### Parameters

##### context

`string`

##### dockerfileName?

`string`

#### Returns

`GenericContainerBuilder`

#### Inherited from

`GenericContainer.fromDockerfile`
