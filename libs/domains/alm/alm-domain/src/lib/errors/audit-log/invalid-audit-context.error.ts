import { Maybe, Primitive } from "@ecoma/common-types";
import { AuditLogDomainError } from "./audit-log-domain.error";

/**
 * Lỗi khi tạo mới AuditContext với dữ liệu không hợp lệ
 */
export class InvalidAuditContextError extends AuditLogDomainError {
  constructor(message: string, params?: Record<string, Maybe<Primitive>>) {
    super(message, params);
  }
}
