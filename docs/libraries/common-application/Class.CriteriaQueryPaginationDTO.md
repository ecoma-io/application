# Class: CriteriaQueryPaginationDTO

## Description

Interface đánh dấu (marker interface) cho tất cả các Data Transfer Object (DTO)
trong hệ thống. DTO được sử dụng để truyền dữ liệu giữa các tầng hoặc service.

## Extends

- [`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new CriteriaQueryPaginationDTO**(): `CriteriaQueryPaginationDTO`

#### Returns

`CriteriaQueryPaginationDTO`

#### Inherited from

[`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md).[`constructor`](/libraries/common-application/Class.DataTransferObject.md#constructor)

## Properties

<a id="after"></a>

### after?

> `optional` **after**: `string`

---

<a id="before"></a>

### before?

> `optional` **before**: `string`

---

<a id="limit"></a>

### limit?

> `optional` **limit**: `number`

---

<a id="offset"></a>

### offset?

> `optional` **offset**: `number`

---

<a id="paginationtype"></a>

### paginationType

> **paginationType**: [`PaginationType`](/libraries/common-application/Enumeration.PaginationType.md)
