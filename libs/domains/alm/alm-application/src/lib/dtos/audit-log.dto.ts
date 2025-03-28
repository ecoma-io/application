/**
 * @fileoverview DTO cho audit log
 * @since 1.0.0
 */

import { Initiator } from '@ecoma/alm-domain';

/**
 * DTO cho audit log
 */
export class AuditLogDto {
  /**
   * Khởi tạo một instance của AuditLogDto
   * @param {string} id - ID của audit log
   * @param {string} eventId - ID của event
   * @param {Date} timestamp - Thời điểm xảy ra event
   * @param {Initiator} initiator - Người thực hiện hành động
   * @param {string} boundedContext - Bounded context của event
   * @param {string} actionType - Loại hành động
   * @param {string} [category] - Danh mục của event
   * @param {string} [severity] - Mức độ nghiêm trọng
   * @param {string} [entityId] - ID của entity liên quan
   * @param {string} [entityType] - Loại entity
   * @param {string} [description] - Mô tả chi tiết
   * @param {boolean} [isSuccess] - Kết quả thực hiện
   * @param {string} [failureReason] - Lý do thất bại nếu có
   */
  constructor(
    public readonly id: string,
    public readonly eventId: string,
    public readonly timestamp: Date,
    public readonly initiator: Initiator,
    public readonly boundedContext: string,
    public readonly actionType: string,
    public readonly category?: string,
    public readonly severity?: string,
    public readonly entityId?: string,
    public readonly entityType?: string,
    public readonly description?: string,
    public readonly isSuccess?: boolean,
    public readonly failureReason?: string
  ) {}
}
