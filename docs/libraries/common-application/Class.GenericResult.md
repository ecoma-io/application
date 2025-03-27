# Class: GenericResult\<TData, TDetails\>

**`Interface`**

IGenericResult

## Description

DTO chứa kết quả trả về từ hệ thống.

## Extends

- [`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md)

## Extended by

- [`CusorBasedPaginatedDTO`](/libraries/common-application/Class.CusorBasedPaginatedDTO.md)
- [`OffsetBasedPaginatedDTO`](/libraries/common-application/Class.OffsetBasedPaginatedDTO.md)

## Type Parameters

### TData

`TData`

Kiểu dữ liệu của dữ liệu trả về.

### TDetails

`TDetails` = `unknown`

Kiểu dữ liệu của chi tiết lỗi.

## Constructors

<a id="constructor"></a>

### Constructor

> **new GenericResult**\<`TData`, `TDetails`\>(): `GenericResult`\<`TData`, `TDetails`\>

#### Returns

`GenericResult`\<`TData`, `TDetails`\>

#### Inherited from

[`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md).[`constructor`](/libraries/common-application/Class.DataTransferObject.md#constructor)

## Properties

<a id="data"></a>

### data?

> `readonly` `optional` **data**: `TData`

#### Description

Dữ liệu trả về từ hệ thống.

---

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `TDetails`

#### Description

Chi tiết lỗi. Trường này có thể chứa thông tin bổ sung về lỗi, ví dụ:

- Danh sách lỗi validation cho từng trường (dùng để hiển thị lỗi trên form frontend)
- Thông tin chi tiết về nguyên nhân lỗi (stack trace, context, ...)
- Có thể là object, string, hoặc bất kỳ kiểu nào phù hợp với use-case
- Nếu là lỗi validation, nên trả về dạng mảng/object gồm các trường và message tương ứng để frontend hiển thị trực tiếp
  Ví dụ:

```ts
details: [
  { field: "email", message: "Email không hợp lệ" },
  { field: "password", message: "Mật khẩu quá ngắn" },
];
```

---

<a id="error"></a>

### error?

> `readonly` `optional` **error**: `string`

#### Description

Thông báo lỗi.

---

<a id="success"></a>

### success

> `readonly` **success**: `boolean`

#### Description

Trạng thái thành công của hệ thống.
