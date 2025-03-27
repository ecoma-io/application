# Interface: IInclusionCondition

## Description

Điều kiện lọc dùng các toán tử tập hợp (kiểm tra giá trị nằm trong/không nằm trong tập hợp).
IInclusionCondition

## Properties

<a id="field"></a>

### field

> **field**: `string`

#### Description

Tên trường cần kiểm tra

---

<a id="operator"></a>

### operator

> **operator**: [`InclusionOperator`](/libraries/common-application/TypeAlias.InclusionOperator.md)

#### Description

Toán tử tập hợp

---

<a id="value"></a>

### value

> **value**: [`Nullable`](/libraries/common-application/TypeAlias.Nullable.md)\<`Primitive`\>[]

#### Description

Mảng các giá trị cần kiểm tra
