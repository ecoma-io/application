/**
 * @interface IQuery
 * @description Interface đánh dấu (marker interface) cho tất cả các Query trong hệ thống.
 * Query biểu thị một yêu cầu truy vấn dữ liệu mà không thay đổi trạng thái.
 * Các Query cụ thể sẽ kế thừa hoặc triển khai interface này và thêm các thuộc tính cần thiết.
 */
export interface IQuery {

  /**
   * @property traceId
   * @description ID truy vết cho luồng xử lý này (correlation ID).
   * Giúp theo dõi yêu cầu qua nhiều service.
   */
  readonly traceId?: string;

  /**
   * @property version
   * @description Phiên bản của command.
   */
  readonly version: string;

  /**
   * @property language
   * @description Ngôn ngữ của command.
   */
  readonly language?: string;
}