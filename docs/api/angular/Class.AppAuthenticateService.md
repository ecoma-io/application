# Class: AppAuthenticateService

## Constructors

<a id="constructor"></a>

### Constructor

> **new AppAuthenticateService**(`domains`, `cookie`): `AppAuthenticateService`

#### Parameters

##### domains

[`Domains`](/api/angular/Class.Domains.md)

##### cookie

[`Cookies`](/api/angular/Class.Cookies.md)

#### Returns

`AppAuthenticateService`

## Methods

<a id="getaccesstoken"></a>

### getAccessToken()

> **getAccessToken**(): `Observable`\<`undefined` \| `string`\>

#### Returns

`Observable`\<`undefined` \| `string`\>

---

<a id="getuserinfo"></a>

### getUserInfo()

> **getUserInfo**(): `Observable`\<`undefined` \| [`ICurrentUserInfo`](/api/angular/Interface.ICurrentUserInfo.md)\>

#### Returns

`Observable`\<`undefined` \| [`ICurrentUserInfo`](/api/angular/Interface.ICurrentUserInfo.md)\>

---

<a id="isauthenticated"></a>

### isAuthenticated()

> **isAuthenticated**(): `boolean`

#### Returns

`boolean`

---

<a id="setaccesstoken"></a>

### setAccessToken()

> **setAccessToken**(`token`): `void`

#### Parameters

##### token

`string`

#### Returns

`void`

---

<a id="setcurrentuserinfo"></a>

### setCurrentUserInfo()

> **setCurrentUserInfo**(`userInfo`): `void`

#### Parameters

##### userInfo

`Omit`\<[`ICurrentUserInfo`](/api/angular/Interface.ICurrentUserInfo.md), `"token"`\>

#### Returns

`void`

---

<a id="signout"></a>

### signOut()

> **signOut**(): `void`

#### Returns

`void`
