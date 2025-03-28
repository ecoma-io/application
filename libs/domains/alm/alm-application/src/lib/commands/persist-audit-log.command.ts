/**
 * @fileoverview Command để lưu trữ audit log
 * @since 1.0.0
 */

import { ICommand } from '@ecoma/common-application';
import { Initiator } from '@ecoma/alm-domain';

/**
 * Command để lưu trữ audit log
 */
export class PersistAuditLogCommand implements ICommand {
  /** Version của command */
  public readonly version = '1.0.0';

  /**
   * Khởi tạo một instance của PersistAuditLogCommand
   * @param {string} eventId - ID của event
   * @param {Date} timestamp - Thời điểm xảy ra event
   * @param {Initiator} initiator - Người thực hiện hành động
   * @param {string} boundedContext - Bounded context của event
   * @param {string} actionType - Loại hành động
   * @param {string} [tenantId] - ID của tenant
   * @param {string} [category] - Danh mục của event
   * @param {string} [severity] - Mức độ nghiêm trọng
   * @param {string} [entityId] - ID của entity liên quan
   * @param {string} [entityType] - Loại entity
   * @param {string} [description] - Mô tả chi tiết
   * @param {string} [status] - Trạng thái của event (SUCCESS/FAILURE)
   * @param {string} [failureReason] - Lý do thất bại nếu có
   */
  constructor(
    public readonly eventId: string,
    public readonly timestamp: Date,
    public readonly initiator: Initiator,
    public readonly boundedContext: string,
    public readonly actionType: string,
    public readonly tenantId?: string,
    public readonly category?: string,
    public readonly severity?: string,
    public readonly entityId?: string,
    public readonly entityType?: string,
    public readonly description?: string,
    public readonly status?: string,
    public readonly failureReason?: string
  ) {}

  /**
   * Kiểm tra xem event có thành công hay không
   * @returns {boolean} True nếu event thành công
   */
  get isSuccess(): boolean {
    return this.status === 'SUCCESS';
  }
}
