import { AuditLogEntry } from "@ecoma/alm-domain";
import { ILogger, IQueryHandler } from "@ecoma/common-application";
import { GetAuditLogsQuery } from "../queries/get-audit-logs.query";
import { AuditLogService } from "../services/audit-log.service";

/**
 * @fileoverview Handler xử lý query tìm kiếm audit logs
 * @since 1.0.0
 */

/**
 * Handler xử lý query truy vấn audit logs
 * @class
 */
export class GetAuditLogsHandler
  implements
    IQueryHandler<
      GetAuditLogsQuery,
      { items: AuditLogEntry[]; total: number; page: number; pageSize: number }
    >
{
  /**
   * Khởi tạo một instance của GetAuditLogsHandler
   * @param {AuditLogService} auditLogService - Service xử lý audit log
   * @param {ILogger} logger - Logger để ghi log
   */
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý query truy vấn audit logs
   * @param query Query chứa tiêu chí truy vấn
   * @returns Promise<{items: AuditLogEntry[], total: number, page: number, pageSize: number}> Kết quả truy vấn
   */
  async handle(
    query: GetAuditLogsQuery
  ): Promise<{
    items: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    // Truy cập page và pageSize từ cấu trúc cụ thể chứ không từ criteria
    const page = (query.criteria as any).page || 1;
    const pageSize = (query.criteria as any).pageSize || 10;
    
    this.logger.debug("Received query to find audit logs", {
      criteria: JSON.stringify(query.criteria),
      page,
      pageSize,
    });

    try {
      const startTime = Date.now();
      const result = await this.auditLogService.findAuditLogs(query);
      const elapsedTime = Date.now() - startTime;

      this.logger.info("Successfully processed audit logs search query", {
        totalRecords: result.total,
        recordCount: result.items.length,
        page: result.page || 1,
        pageSize: result.pageSize || 10,
        elapsedTimeMs: elapsedTime,
      });

      return {
        items: result.items,
        total: result.total || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 10,
      };
    } catch (error) {
      this.logger.error(
        "Error processing audit logs search query",
        error instanceof Error ? error : new Error(String(error)),
        {
          criteria: JSON.stringify(query.criteria),
        }
      );

      // Trả về kết quả rỗng trong trường hợp lỗi
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };
    }
  }
}
