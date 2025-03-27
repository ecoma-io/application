# Interface: IConfigModuleOptions

Interface for ConfigModule options

## Extends

- `ConfigModuleOptions`

## Properties

<a id="appconfig"></a>

### appConfig?

> `optional` **appConfig**: `Type`\<[`AppConfig`](/libraries/common-infrastructure/Class.AppConfig.md)\>

Application-specific configuration

---

<a id="cache"></a>

### cache?

> `optional` **cache**: `boolean`

If "true", values from the process.env object will be cached in the memory.
This improves the overall application performance.
See: https://github.com/nodejs/node/issues/3104

#### Inherited from

`NestConfigModuleOptions.cache`

---

<a id="envfilepath"></a>

### envFilePath?

> `optional` **envFilePath**: `string` \| `string`[]

Path to the environment file(s) to be loaded.

#### Inherited from

`NestConfigModuleOptions.envFilePath`

---

<a id="expandvariables"></a>

### expandVariables?

> `optional` **expandVariables**: `boolean` \| `DotenvExpandOptions`

A boolean value indicating the use of expanded variables, or object
containing options to pass to dotenv-expand.
If .env contains expanded variables, they'll only be parsed if
this property is set to true.

#### Inherited from

`NestConfigModuleOptions.expandVariables`

---

<a id="ignoreenvfile"></a>

### ignoreEnvFile?

> `optional` **ignoreEnvFile**: `boolean`

If "true", environment files (`.env`) will be ignored.

#### Inherited from

`NestConfigModuleOptions.ignoreEnvFile`

---

<a id="ignoreenvvars"></a>

### ~~ignoreEnvVars?~~

> `optional` **ignoreEnvVars**: `boolean`

If "true", predefined environment variables will not be validated.

#### Deprecated

Use `validatePredefined` instead.

#### Inherited from

`NestConfigModuleOptions.ignoreEnvVars`

---

<a id="isglobal"></a>

### isGlobal?

> `optional` **isGlobal**: `boolean`

If "true", registers `ConfigModule` as a global module.
See: https://docs.nestjs.com/modules#global-modules

#### Inherited from

`NestConfigModuleOptions.isGlobal`

---

<a id="load"></a>

### load?

> `optional` **load**: (`ConfigFactory` \| `Promise`\<`ConfigFactory`\>)[]

Array of custom configuration files to be loaded.
See: https://docs.nestjs.com/techniques/configuration

#### Inherited from

`NestConfigModuleOptions.load`

---

<a id="providers"></a>

### providers?

> `optional` **providers**: `Type`\<`any`\>[]

Additional configuration providers

---

<a id="skipprocessenv"></a>

### skipProcessEnv?

> `optional` **skipProcessEnv**: `boolean`

If "true", process environment variables (process.env) will be ignored and not picked up by the `ConfigService#get` method.

#### Default

```ts
false;
```

#### Inherited from

`NestConfigModuleOptions.skipProcessEnv`

---

<a id="validate"></a>

### validate()?

> `optional` **validate**: (`config`) => `Record`\<`string`, `any`\>

Custom function to validate environment variables. It takes an object containing environment
variables as input and outputs validated environment variables.
If exception is thrown in the function it would prevent the application from bootstrapping.
Also, environment variables can be edited through this function, changes
will be reflected in the process.env object.

#### Parameters

##### config

`Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Inherited from

`NestConfigModuleOptions.validate`

---

<a id="validatepredefined"></a>

### validatePredefined?

> `optional` **validatePredefined**: `boolean`

If "true", predefined environment variables will be validated.
Predefined environment variables are process variables (process.env variables) that were set before the module was imported.
For example, if you start your application with `PORT=3000 node main.js`, then `PORT` is a predefined environment variable.
Variables that were loaded by the `ConfigModule` from the .env file are not considered predefined.

#### Default

```ts
true;
```

#### Inherited from

`NestConfigModuleOptions.validatePredefined`

---

<a id="validationoptions"></a>

### validationOptions?

> `optional` **validationOptions**: `Record`\<`string`, `any`\>

Schema validation options.
See: https://joi.dev/api/?v=17.3.0#anyvalidatevalue-options

#### Inherited from

`NestConfigModuleOptions.validationOptions`

---

<a id="validationschema"></a>

### validationSchema?

> `optional` **validationSchema**: `any`

Environment variables validation schema (Joi).

#### Inherited from

`NestConfigModuleOptions.validationSchema`
