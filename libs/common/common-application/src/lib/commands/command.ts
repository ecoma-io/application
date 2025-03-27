/**
 * @interface ICommand
 * @description Interface đánh dấu (marker interface) cho tất cả các Command trong hệ thống.
 * Command biểu thị một yêu cầu thực hiện một hành động thay đổi trạng thái.
 * Các Command cụ thể sẽ kế thừa hoặc triển khai interface này và thêm các thuộc tính cần thiết.
 */
export interface ICommand {

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