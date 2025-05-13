import { ApplicationError } from '@ecoma/common-application';

/**
 * Lỗi được ném khi tiêu chí truy vấn không hợp lệ
 */
export class InvalidQueryCriteriaError extends ApplicationError {
  /**
   * Tạo mới một lỗi InvalidQueryCriteria
   * @param message Thông báo lỗi
   */
  constructor(message: string) {
    super(message);
  }
}
