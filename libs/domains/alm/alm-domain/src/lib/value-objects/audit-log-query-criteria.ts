/**
 * @fileoverview Type định nghĩa tiêu chí truy vấn audit log
 * @since 1.0.0
 */

import { Initiator } from '../value-objects/initiator';

/**
 * Type định nghĩa tiêu chí truy vấn audit log
 */
export type AuditLogQueryCriteria = {
  /** Bounded context của audit log */
  boundedContext?: string;

  /** Loại hành động */
  actionType?: string;

  /** Danh mục của audit log */
  category?: string;

  /** Mức độ nghiêm trọng */
  severity?: string;

  /** ID của entity liên quan */
  entityId?: string;

  /** Loại entity */
  entityType?: string;

  /** Người thực hiện hành động */
  initiator?: Initiator;

  /** Ngày bắt đầu */
  fromDate?: Date;

  /** Ngày kết thúc */
  toDate?: Date;
};
