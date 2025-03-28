/**
 * @fileoverview DTO định nghĩa các tiêu chí để truy vấn audit log
 * @since 1.0.0
 */

import { Initiator } from '@ecoma/alm-domain';

/**
 * DTO chứa các tiêu chí để truy vấn audit log
 */
export class AuditLogQueryCriteriaDto {
  /**
   * Khởi tạo một instance của AuditLogQueryCriteriaDto
   * @param {string} [boundedContext] - Bounded context của audit log
   * @param {string} [actionType] - Loại hành động
   * @param {string} [category] - Danh mục của audit log
   * @param {string} [severity] - Mức độ nghiêm trọng
   * @param {string} [entityId] - ID của entity liên quan
   * @param {string} [entityType] - Loại entity
   * @param {Initiator} [initiator] - Người thực hiện hành động
   * @param {Date} [fromDate] - Ngày bắt đầu
   * @param {Date} [toDate] - Ngày kết thúc
   */
  constructor(
    public readonly boundedContext?: string,
    public readonly actionType?: string,
    public readonly category?: string,
    public readonly severity?: string,
    public readonly entityId?: string,
    public readonly entityType?: string,
    public readonly initiator?: Initiator,
    public readonly fromDate?: Date,
    public readonly toDate?: Date
  ) {}
}
