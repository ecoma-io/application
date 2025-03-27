# Interface: IEncryption

Interface định nghĩa các phương thức mã hóa và giải mã dữ liệu

## Methods

<a id="decrypt"></a>

### decrypt()

> **decrypt**(`encryptedData`): `Promise`\<`string`\>

Giải mã một chuỗi dữ liệu đã được mã hóa

#### Parameters

##### encryptedData

`string`

Dữ liệu đã được mã hóa

#### Returns

`Promise`\<`string`\>

Dữ liệu đã được giải mã

#### Throws

Nếu quá trình giải mã thất bại

***

<a id="encrypt"></a>

### encrypt()

> **encrypt**(`data`): `Promise`\<`string`\>

Mã hóa một chuỗi dữ liệu

#### Parameters

##### data

`string`

Dữ liệu cần mã hóa

#### Returns

`Promise`\<`string`\>

Dữ liệu đã được mã hóa

#### Throws

Nếu quá trình mã hóa thất bại
