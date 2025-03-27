import { AuditLogEntryId, RetentionPolicyId } from '@ecoma/alm-domain';

/**
 * Interface định nghĩa factory để tạo ID cho audit log entry.
 */
export interface IAuditLogIdFactory {
  /**
   * Tạo một ID mới cho audit log entry.
   * @returns ID mới được tạo
   */
  create(): AuditLogEntryId;
}

/**
 * Interface định nghĩa factory để tạo ID cho retention policy.
 */
export interface IRetentionPolicyIdFactory {
  /**
   * Tạo một ID mới cho retention policy.
   * @returns ID mới được tạo
   */
  create(): RetentionPolicyId;
}
