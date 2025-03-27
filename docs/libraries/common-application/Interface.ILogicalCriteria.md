# Interface: ILogicalCriteria

## Description

Đại diện cho một nhóm các tiêu chí con được kết hợp bằng toán tử logic (AND, OR, NOT).
ILogicalCriteria

## Properties

<a id="and"></a>

### and?

> `optional` **and**: [`FilterCriteria`](/libraries/common-application/TypeAlias.FilterCriteria.md)[]

#### Description

Mảng các tiêu chí kết hợp bằng AND

---

<a id="not"></a>

### not?

> `optional` **not**: [`FilterCriteria`](/libraries/common-application/TypeAlias.FilterCriteria.md)

#### Description

Tiêu chí phủ định (NOT)

---

<a id="or"></a>

### or?

> `optional` **or**: [`FilterCriteria`](/libraries/common-application/TypeAlias.FilterCriteria.md)[]

#### Description

Mảng các tiêu chí kết hợp bằng OR
