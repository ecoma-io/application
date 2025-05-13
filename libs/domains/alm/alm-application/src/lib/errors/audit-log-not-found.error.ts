import { ApplicationError } from '@ecoma/common-application';

/**
 * Lỗi được ném khi không tìm thấy bản ghi kiểm tra với ID đã cung cấp
 */
export class AuditLogNotFoundError extends ApplicationError {
  /**
   * Tạo mới một lỗi AuditLogNotFound
   * @param id ID của bản ghi kiểm tra không tìm thấy
   */
  constructor(id: string) {
    super('Can\'t find record with ID: {id}', {id});
  }
}
