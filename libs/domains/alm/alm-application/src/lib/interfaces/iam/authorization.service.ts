/**
 * @fileoverview Interface định nghĩa phương thức kiểm tra quyền truy cập audit log
 * @since 1.0.0
 */

import { AuditLogQueryCriteria } from '@ecoma/alm-domain';

/**
 * Interface định nghĩa phương thức kiểm tra quyền truy cập audit logs với IAM
 * @interface
 */
export interface IAuthorizationService {
  /**
   * Kiểm tra quyền truy cập audit logs
   * @param {AuditLogQueryCriteria} criteria - Tiêu chí truy vấn
   * @returns {Promise<boolean>} True nếu có quyền truy cập
   */
  canAccessAuditLogs(criteria: AuditLogQueryCriteria): Promise<boolean>;

  /**
   * Kiểm tra quyền truy cập audit logs dựa trên tiêu chí truy vấn
   * @param userId ID của người dùng cần kiểm tra quyền
   * @param criteria Tiêu chí truy vấn audit logs
   * @returns Promise<boolean> True nếu có quyền truy cập, False nếu không
   */
  canAccessAuditLogs(userId: string, criteria: AuditLogQueryCriteria): Promise<boolean>;

  /**
   * Kiểm tra quyền quản lý retention policy
   * @param userId ID của người dùng cần kiểm tra quyền
   * @returns Promise<boolean> True nếu có quyền quản lý, False nếu không
   */
  canManageRetentionPolicy(userId: string): Promise<boolean>;
}
