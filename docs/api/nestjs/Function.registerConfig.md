# Function: registerConfig()

> **registerConfig**\<`TEnviromentObject`, `TConfig`\>(`token`, `envClss`, `defaults`, `callback`): () => `TConfig` & `ConfigFactoryKeyHost`\<`TConfig`\>

## Type Parameters

### TEnviromentObject

`TEnviromentObject`

### TConfig

`TConfig` _extends_ `ConfigObject` = `ConfigObject`

## Parameters

### token

`string`

### envClss

`ClassConstructor`\<`TEnviromentObject`\>

### defaults

`undefined` | \{[`key`: `string`]: `string`; \}

### callback

(`enviroments`) => `TConfig`

## Returns

() => `TConfig` & `ConfigFactoryKeyHost`\<`TConfig`\>
