# Class: ConfigService

Extended configuration service

## Extends

- `ConfigService`

## Constructors

<a id="constructor"></a>

### Constructor

> **new ConfigService**(`internalConfig?`): `ConfigService`

#### Parameters

##### internalConfig?

`Record`\<`string`, `any`\>

#### Returns

`ConfigService`

#### Inherited from

`NestConfigService.constructor`

## Accessors

<a id="changes"></a>

### changes$

#### Get Signature

> **get** **changes$**(): `Observable`\<`ConfigChangeEvent`\<`any`, `any`\>\>

Returns a stream of configuration changes.
Each event contains the attribute path, the old value and the new value.

##### Returns

`Observable`\<`ConfigChangeEvent`\<`any`, `any`\>\>

#### Inherited from

`NestConfigService.changes$`

## Methods

<a id="get"></a>

### get()

#### Call Signature

> **get**\<`T`\>(`propertyPath`): `undefined` \| `T`

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### propertyPath

`string` | `symbol`

##### Returns

`undefined` \| `T`

##### Inherited from

`NestConfigService.get`

#### Call Signature

> **get**\<`T`, `P`, `R`\>(`propertyPath`, `options`): `undefined` \| `R`

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").

##### Type Parameters

###### T

`T` = `Record`\<`string` \| `symbol`, `unknown`\>

###### P

`P` _extends_ `string` = `any`

###### R

`R` = `PathValue`\<`T`, `P`\>

##### Parameters

###### propertyPath

`P`

###### options

`ConfigGetOptions`

##### Returns

`undefined` \| `R`

##### Inherited from

`NestConfigService.get`

#### Call Signature

> **get**\<`T`\>(`propertyPath`, `defaultValue`): `T`

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
It returns a default value if the key does not exist.

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### propertyPath

`string` | `symbol`

###### defaultValue

`NoInferType`\<`T`\>

##### Returns

`T`

##### Inherited from

`NestConfigService.get`

#### Call Signature

> **get**\<`T`, `P`, `R`\>(`propertyPath`, `defaultValue`, `options`): `Exclude`\<`R`, `undefined`\>

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
It returns a default value if the key does not exist.

##### Type Parameters

###### T

`T` = `Record`\<`string` \| `symbol`, `unknown`\>

###### P

`P` _extends_ `string` = `any`

###### R

`R` = `PathValue`\<`T`, `P`\>

##### Parameters

###### propertyPath

`P`

###### defaultValue

`NoInferType`\<`R`\>

###### options

`ConfigGetOptions`

##### Returns

`Exclude`\<`R`, `undefined`\>

##### Inherited from

`NestConfigService.get`

---

<a id="getenvironment"></a>

### getEnvironment()

> **getEnvironment**(): [`Environment`](/libraries/common-infrastructure/Enumeration.Environment.md)

Get application environment

#### Returns

[`Environment`](/libraries/common-infrastructure/Enumeration.Environment.md)

---

<a id="getlogformat"></a>

### getLogFormat()

> **getLogFormat**(): [`LogFormat`](/libraries/common-infrastructure/Enumeration.LogFormat.md)

Get log format

#### Returns

[`LogFormat`](/libraries/common-infrastructure/Enumeration.LogFormat.md)

---

<a id="getloglevel"></a>

### getLogLevel()

> **getLogLevel**(): [`LogLevel`](/libraries/common-infrastructure/Enumeration.LogLevel.md)

Get log level

#### Returns

[`LogLevel`](/libraries/common-infrastructure/Enumeration.LogLevel.md)

---

<a id="getmongodbconfig"></a>

### getMongoDBConfig()

> **getMongoDBConfig**(): [`IMongoDBConfig`](/libraries/common-infrastructure/Interface.IMongoDBConfig.md)

Get MongoDB configuration

#### Returns

[`IMongoDBConfig`](/libraries/common-infrastructure/Interface.IMongoDBConfig.md)

---

<a id="getnatsconfig"></a>

### getNatsConfig()

> **getNatsConfig**(): [`INatsConfig`](/libraries/common-infrastructure/Interface.INatsConfig.md)

Get NATS configuration

#### Returns

[`INatsConfig`](/libraries/common-infrastructure/Interface.INatsConfig.md)

---

<a id="getorthrow"></a>

### getOrThrow()

#### Call Signature

> **getOrThrow**\<`T`\>(`propertyPath`): `Exclude`\<`T`, `undefined`\>

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### propertyPath

`string` | `symbol`

##### Returns

`Exclude`\<`T`, `undefined`\>

##### Inherited from

`NestConfigService.getOrThrow`

#### Call Signature

> **getOrThrow**\<`T`, `P`, `R`\>(`propertyPath`, `options`): `Exclude`\<`R`, `undefined`\>

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").

##### Type Parameters

###### T

`T` = `Record`\<`string` \| `symbol`, `unknown`\>

###### P

`P` _extends_ `string` = `any`

###### R

`R` = `PathValue`\<`T`, `P`\>

##### Parameters

###### propertyPath

`P`

###### options

`ConfigGetOptions`

##### Returns

`Exclude`\<`R`, `undefined`\>

##### Inherited from

`NestConfigService.getOrThrow`

#### Call Signature

> **getOrThrow**\<`T`\>(`propertyPath`, `defaultValue`): `Exclude`\<`T`, `undefined`\>

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
It returns a default value if the key does not exist.
If the default value is undefined an exception will be thrown.

##### Type Parameters

###### T

`T` = `any`

##### Parameters

###### propertyPath

`string` | `symbol`

###### defaultValue

`NoInferType`\<`T`\>

##### Returns

`Exclude`\<`T`, `undefined`\>

##### Inherited from

`NestConfigService.getOrThrow`

#### Call Signature

> **getOrThrow**\<`T`, `P`, `R`\>(`propertyPath`, `defaultValue`, `options`): `Exclude`\<`R`, `undefined`\>

Get a configuration value (either custom configuration or process environment variable)
based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
It returns a default value if the key does not exist.
If the default value is undefined an exception will be thrown.

##### Type Parameters

###### T

`T` = `Record`\<`string` \| `symbol`, `unknown`\>

###### P

`P` _extends_ `string` = `any`

###### R

`R` = `PathValue`\<`T`, `P`\>

##### Parameters

###### propertyPath

`P`

###### defaultValue

`NoInferType`\<`R`\>

###### options

`ConfigGetOptions`

##### Returns

`Exclude`\<`R`, `undefined`\>

##### Inherited from

`NestConfigService.getOrThrow`

---

<a id="getport"></a>

### getPort()

> **getPort**(): `number`

Get application port

#### Returns

`number`

---

<a id="getrabbitmqconfig"></a>

### getRabbitMQConfig()

> **getRabbitMQConfig**(): [`IRabbitMQConfig`](/libraries/common-infrastructure/Interface.IRabbitMQConfig.md)

Get RabbitMQ configuration

#### Returns

[`IRabbitMQConfig`](/libraries/common-infrastructure/Interface.IRabbitMQConfig.md)

---

<a id="getredisconfig"></a>

### getRedisConfig()

> **getRedisConfig**(): [`IRedisConfig`](/libraries/common-infrastructure/Interface.IRedisConfig.md)

Get Redis configuration

#### Returns

[`IRedisConfig`](/libraries/common-infrastructure/Interface.IRedisConfig.md)

---

<a id="gets3config"></a>

### getS3Config()

> **getS3Config**(): [`IS3Config`](/libraries/common-infrastructure/Interface.IS3Config.md)

Get S3 configuration

#### Returns

[`IS3Config`](/libraries/common-infrastructure/Interface.IS3Config.md)

---

<a id="isdebug"></a>

### isDebug()

> **isDebug**(): `boolean`

Get debug mode

#### Returns

`boolean`

---

<a id="set"></a>

### set()

> **set**\<`T`\>(`propertyPath`, `value`): `void`

Sets a configuration value based on property path.

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### propertyPath

`string` | `symbol`

##### value

`T`

#### Returns

`void`

#### Inherited from

`NestConfigService.set`

---

<a id="setenvfilepaths"></a>

### setEnvFilePaths()

> **setEnvFilePaths**(`paths`): `void`

Sets env file paths from `config.module.ts` to parse.

#### Parameters

##### paths

`string`[]

#### Returns

`void`

#### Inherited from

`NestConfigService.setEnvFilePaths`
