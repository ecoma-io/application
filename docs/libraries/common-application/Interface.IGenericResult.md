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

***

<a id="details"></a>

### details

> `readonly` **details**: `TDetails`

#### Description

Chi tiết lỗi.

***

<a id="error"></a>

### error

> `readonly` **error**: `string`

#### Description

Thông báo lỗi.

***

<a id="success"></a>

### success

> `readonly` **success**: `boolean`

#### Description

Trạng thái thành công của hệ thống.
