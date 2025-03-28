import { IQueryHandler } from '@ecoma/common-application';
import { AuditLogService } from '../services/audit-log.service';
import { GetAuditLogsQuery } from '../queries/get-audit-logs.query';
import { AuditLogEntry } from '@ecoma/alm-domain';

/**
 * Handler xử lý query truy vấn audit logs
 * @class
 */
export class GetAuditLogsHandler implements IQueryHandler<GetAuditLogsQuery, { items: AuditLogEntry[], total: number, page: number, pageSize: number }> {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Xử lý query truy vấn audit logs
   * @param query Query chứa tiêu chí truy vấn
   * @returns Promise<{items: AuditLogEntry[], total: number, page: number, pageSize: number}> Kết quả truy vấn
   */
  async handle(query: GetAuditLogsQuery): Promise<{ items: AuditLogEntry[], total: number, page: number, pageSize: number }> {
    const result = await this.auditLogService.findAuditLogs(query);
    return {
      items: result.items,
      total: result.total || 0,
      page: result.page || 1,
      pageSize: result.pageSize || 10
    };
  }
}
