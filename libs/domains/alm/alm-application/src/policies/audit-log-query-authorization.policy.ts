/**
 * Interface định nghĩa policy kiểm tra quyền truy vấn audit logs.
 */
export interface IAuditLogQueryAuthorizationPolicy {
  /**
   * Kiểm tra user có quyền truy vấn audit logs với tiêu chí query không.
   * @param user - Thông tin user (id, roles, tenantId)
   * @param query - Tiêu chí truy vấn
   * @returns Promise<boolean> - true nếu user có quyền, false nếu không
   */
  canQueryAuditLogs(user: { id: string; roles: string[]; tenantId?: string }, query: any): Promise<boolean>;
}

/**
 * Lớp thực thi policy kiểm tra quyền truy vấn audit logs.
 */
export class AuditLogQueryAuthorizationPolicy implements IAuditLogQueryAuthorizationPolicy {
  /**
   * Kiểm tra quyền truy vấn audit logs của user.
   * @param user - Thông tin user cần kiểm tra quyền
   * @param query - Tiêu chí truy vấn
   * @returns Promise<boolean> - true nếu user có quyền, false nếu không
   */
  async canQueryAuditLogs(user: { id: string; roles: string[]; tenantId?: string }, query: any): Promise<boolean> {
    // TODO: Gọi IAM service để kiểm tra quyền thực tế
    // Giả lập: chỉ cho phép nếu user có role 'admin' hoặc 'audit-log-viewer'
    return user.roles.includes('admin') || user.roles.includes('audit-log-viewer');
  }
}
