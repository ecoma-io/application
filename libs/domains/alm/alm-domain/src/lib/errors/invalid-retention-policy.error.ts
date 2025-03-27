import { DomainError } from '@ecoma/common-domain';
import { Dict, Maybe, Primitive } from '@ecoma/common-types';

/**
 * Lỗi domain khi dữ liệu Retention Policy không hợp lệ
 */
export class InvalidRetentionPolicyError extends DomainError<Dict<unknown>> {
  /**
   * Khởi tạo lỗi dữ liệu Retention Policy không hợp lệ
   * @param message Thông báo lỗi
   * @param interpolationParams Tham số nội suy
   * @param details Chi tiết lỗi
   */
  constructor(message: string, interpolationParams?: Record<string, Maybe<Primitive>>, details?: Dict<unknown>) {
    super(message, interpolationParams, details);
  }
}
