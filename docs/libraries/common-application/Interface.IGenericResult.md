# Interface: IGenericResult\<TData, TDetails\>

IGenericResult

## Description

DTO chứa kết quả trả về từ hệ thống.

## Extends

- [`IDataTransferObject`](/libraries/common-application/Interface.IDataTransferObject.md)

## Type Parameters

### TData

`TData`

Kiểu dữ liệu của dữ liệu trả về.

### TDetails

`TDetails` = `unknown`

Kiểu dữ liệu của chi tiết lỗi.

## Properties

<a id="data"></a>

### data

> `readonly` **data**: `TData`

#### Description

Dữ liệu trả về từ hệ thống.

---

<a id="details"></a>

### details

> `readonly` **details**: `TDetails`

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

### error

> `readonly` **error**: `string`

#### Description

Thông báo lỗi.

---

<a id="success"></a>

### success

> `readonly` **success**: `boolean`

#### Description

Trạng thái thành công của hệ thống.
