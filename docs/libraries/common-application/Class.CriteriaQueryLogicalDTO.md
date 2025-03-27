# Class: CriteriaQueryLogicalDTO

## Description

Interface đánh dấu (marker interface) cho tất cả các Data Transfer Object (DTO)
trong hệ thống. DTO được sử dụng để truyền dữ liệu giữa các tầng hoặc service.

## Extends

- [`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md)

## Constructors

<a id="constructor"></a>

### Constructor

> **new CriteriaQueryLogicalDTO**(): `CriteriaQueryLogicalDTO`

#### Returns

`CriteriaQueryLogicalDTO`

#### Inherited from

[`DataTransferObject`](/libraries/common-application/Class.DataTransferObject.md).[`constructor`](/libraries/common-application/Class.DataTransferObject.md#constructor)

## Properties

<a id="and"></a>

### and?

> `optional` **and**: ([`CriteriaQueryFilterDTO`](/libraries/common-application/Class.CriteriaQueryFilterDTO.md) \| `CriteriaQueryLogicalDTO`)[]

---

<a id="not"></a>

### not?

> `optional` **not**: [`CriteriaQueryFilterDTO`](/libraries/common-application/Class.CriteriaQueryFilterDTO.md) \| `CriteriaQueryLogicalDTO`

---

<a id="or"></a>

### or?

> `optional` **or**: ([`CriteriaQueryFilterDTO`](/libraries/common-application/Class.CriteriaQueryFilterDTO.md) \| `CriteriaQueryLogicalDTO`)[]
