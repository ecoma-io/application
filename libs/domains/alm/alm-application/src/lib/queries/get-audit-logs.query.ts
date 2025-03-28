/**
 * @fileoverview Query để truy vấn các bản ghi audit log
 * @since 1.0.0
 */

import { IQuery } from '@ecoma/common-application';
import { AuditLogQueryCriteria } from '@ecoma/alm-domain';

/**
 * Query để truy vấn các bản ghi audit log
 */
export class GetAuditLogsQuery implements IQuery {
  /** Version của query */
  public readonly version = '1.0.0';

  /**
   * Khởi tạo một instance của GetAuditLogsQuery
   * @param {AuditLogQueryCriteria} criteria - Tiêu chí truy vấn
   * @param {Object} metadata - Metadata của query
   * @param {Date} metadata.timestamp - Thời điểm tạo query
   * @param {string} metadata.version - Phiên bản của query
   */
  constructor(
    public readonly criteria: AuditLogQueryCriteria,
    public readonly metadata: {
      timestamp: Date;
      version: string;
    }
  ) {}
}
