# Class: ApiTestingHelper

Helper hỗ trợ kiểm thử API NestJS.

## Since

1.1.0

## Constructors

<a id="constructor"></a>

### Constructor

> **new ApiTestingHelper**(): `ApiTestingHelper`

#### Returns

`ApiTestingHelper`

## Methods

<a id="closeapp"></a>

### closeApp()

> `static` **closeApp**(`app`): `Promise`\<`void`\>

Đóng ứng dụng NestJS

#### Parameters

##### app

`INestApplication`

Ứng dụng NestJS

#### Returns

`Promise`\<`void`\>

---

<a id="createapp"></a>

### createApp()

> `static` **createApp**(`module`): `Promise`\<`INestApplication`\<`any`\>\>

Tạo một ứng dụng NestJS từ testing module

#### Parameters

##### module

`TestingModule`

Testing module đã được compile

#### Returns

`Promise`\<`INestApplication`\<`any`\>\>

NestJS application

---

<a id="createrequestagent"></a>

### createRequestAgent()

> `static` **createRequestAgent**(`app`): `TestAgent`\<`Test`\>

Tạo một request agent cho supertest từ ứng dụng NestJS

#### Parameters

##### app

`INestApplication`

Ứng dụng NestJS

#### Returns

`TestAgent`\<`Test`\>

Supertest request agent

---

<a id="createtestclient"></a>

### createTestClient()

> `static` **createTestClient**(`metadata`): `Promise`\<\{ `app`: `INestApplication`; `requestAgent`: `TestAgent`\<`Test`\>; \}\>

Tạo một request agent cho supertest từ metadata module

#### Parameters

##### metadata

`ModuleMetadata`

Metadata của module cần test

#### Returns

`Promise`\<\{ `app`: `INestApplication`; `requestAgent`: `TestAgent`\<`Test`\>; \}\>

Supertest request agent và ứng dụng NestJS

---

<a id="createtestingmodule"></a>

### createTestingModule()

> `static` **createTestingModule**(`metadata`): `Promise`\<`TestingModule`\>

Tạo một testing module NestJS

#### Parameters

##### metadata

`ModuleMetadata`

Metadata của module cần test

#### Returns

`Promise`\<`TestingModule`\>

Testing module
