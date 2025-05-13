import { Maybe, Primitive } from "@ecoma/common-types";
import { AuditLogDomainError } from "./audit-log-domain.error";

/**
 * Lỗi khi tạo mới RetentionPolicy với dữ liệu không hợp lệ
 */
export class InvalidRetentionPolicyError extends AuditLogDomainError {
  constructor(message: string, params?: Record<string, Maybe<Primitive>>) {
    super(message, params);
  }
}
