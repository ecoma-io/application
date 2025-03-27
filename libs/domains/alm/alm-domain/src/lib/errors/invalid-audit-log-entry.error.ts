import { DomainError } from '@ecoma/common-domain';
import { Maybe, Primitive } from '@ecoma/common-types';

/**
 * Lỗi nghiệp vụ khi tạo AuditLogEntry không hợp lệ.
 */
export class InvalidAuditLogEntryError extends DomainError<unknown> {
  /**
   * Khởi tạo lỗi AuditLogEntry không hợp lệ
   * @param message - Thông báo lỗi
   * @param interpolationParams - Tham số nội suy (tùy chọn)
   * @param details - Thông tin chi tiết bổ sung về lỗi
   */
  constructor(message: string, interpolationParams?: Record<string, Maybe<Primitive>>, details?: unknown) {
    super(message, interpolationParams, details);
  }
}
