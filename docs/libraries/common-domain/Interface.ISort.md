# Interface: ISort

## Properties

<a id="direction"></a>

### direction

> **direction**: `"asc"` \| `"desc"`

Hướng sắp xếp ('asc' - tăng dần, 'desc' - giảm dần).

---

<a id="field"></a>

### field

> **field**: `string`

Tên trường của Domain Model (string) cần sắp xếp.
Lớp cài đặt Repository sẽ dịch tên trường này sang tên cột/path tương ứng trong database.
Ví dụ: "createdAt", "customer.name", "totalAmount"
