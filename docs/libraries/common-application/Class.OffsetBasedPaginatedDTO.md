# Class: OffsetBasedPaginatedDTO\<T\>

Interface định nghĩa kết quả phân trang theo offset

## Extends

- [`GenericResult`](/libraries/common-application/Class.GenericResult.md)\<`T`[]\>

## Type Parameters

### T

`T`

## Constructors

<a id="constructor"></a>

### Constructor

> **new OffsetBasedPaginatedDTO**\<`T`\>(): `OffsetBasedPaginatedDTO`\<`T`\>

#### Returns

`OffsetBasedPaginatedDTO`\<`T`\>

#### Inherited from

[`GenericResult`](/libraries/common-application/Class.GenericResult.md).[`constructor`](/libraries/common-application/Class.GenericResult.md#constructor)

## Properties

<a id="data"></a>

### data?

> `readonly` `optional` **data**: `T`[]

#### Description

Dữ liệu trả về từ hệ thống.

#### Inherited from

[`GenericResult`](/libraries/common-application/Class.GenericResult.md).[`data`](/libraries/common-application/Class.GenericResult.md#data)

---

<a id="details"></a>

### details?

> `readonly` `optional` **details**: `unknown`

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

#### Inherited from

[`GenericResult`](/libraries/common-application/Class.GenericResult.md).[`details`](/libraries/common-application/Class.GenericResult.md#details)

---

<a id="error"></a>

### error?

> `readonly` `optional` **error**: `string`

#### Description

Thông báo lỗi.

#### Inherited from

[`GenericResult`](/libraries/common-application/Class.GenericResult.md).[`error`](/libraries/common-application/Class.GenericResult.md#error)

---

<a id="success"></a>

### success

> `readonly` **success**: `boolean`

#### Description

Trạng thái thành công của hệ thống.

#### Inherited from

[`GenericResult`](/libraries/common-application/Class.GenericResult.md).[`success`](/libraries/common-application/Class.GenericResult.md#success)

---

<a id="total"></a>

### total

> **total**: `number`

Tổng số bản ghi
