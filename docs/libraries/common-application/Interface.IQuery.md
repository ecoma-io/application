# Interface: IQuery

IQuery

## Description

Interface đánh dấu (marker interface) cho tất cả các Query trong hệ thống.
Query biểu thị một yêu cầu truy vấn dữ liệu mà không thay đổi trạng thái.
Các Query cụ thể sẽ kế thừa hoặc triển khai interface này và thêm các thuộc tính cần thiết.

## Properties

<a id="language"></a>

### language?

> `readonly` `optional` **language**: `string`

#### Description

Ngôn ngữ của command.

***

<a id="traceid"></a>

### traceId?

> `readonly` `optional` **traceId**: `string`

#### Description

ID truy vết cho luồng xử lý này (correlation ID).
Giúp theo dõi yêu cầu qua nhiều service.

***

<a id="version"></a>

### version

> `readonly` **version**: `string`

#### Description

Phiên bản của command.
