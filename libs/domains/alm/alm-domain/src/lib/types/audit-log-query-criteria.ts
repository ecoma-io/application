/**
 * @fileoverview Type định nghĩa tiêu chí truy vấn audit log
 * @since 1.0.0
 */

/**
 * Type định nghĩa tiêu chí truy vấn audit log
 */
export type AuditLogQueryCriteria = {
  /** ID của tenant */
  tenantId?: string;

  /** ID của người dùng */
  userId?: string;

  /** Loại hành động */
  actionType?: string;

  /** Danh mục */
  category?: string;

  /** Mức độ nghiêm trọng */
  severity?: string;

  /** ID của entity */
  entityId?: string;

  /** Loại entity */
  entityType?: string;

  /** Thời gian bắt đầu */
  startTime?: Date;

  /** Thời gian kết thúc */
  endTime?: Date;

  /** Trạng thái */
  status?: string;
};
