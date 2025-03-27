import { IGenericResult, IQueryHandler } from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import { validateSync } from "class-validator";

import { AuditLogEntryMapper } from "../../mappers";
import { IAuditLogEntryReadRepo } from "../../ports/repository";
import { GetAuditLogsQuery } from "./get-audit-logs.query";

type GetAuditLogsResult = IGenericResult<
  IOffsetBasedPaginatedResult<any>,
  string
>;

export class GetAuditLogsQueryHandler
  implements IQueryHandler<GetAuditLogsQuery, GetAuditLogsResult>
{
  constructor(
    private readonly auditLogRepo: IAuditLogEntryReadRepo,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý truy vấn get audit logs
   * @param query
   */
  async handle(query: GetAuditLogsQuery): Promise<GetAuditLogsResult> {
    this.logger.debug("Bắt đầu xử lý GetAuditLogsQuery", {
      payload: query.payload,
    });
    // Validate DTO
    const errors = validateSync(query.payload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      this.logger.warn("Payload get audit logs không hợp lệ", { errors });
      return {
        success: false,
        error: "INVALID_PAYLOAD",
        details: errors
          .map((e) => Object.values(e.constraints || {}).join(", "))
          .join("; "),
        data: {
          items: [],
          total: 0,
          offset: query.payload.pageNumber,
          limit: query.payload.pageSize,
        },
      };
    }
    try {
      // Mapping DTO sang AuditLogQueryCriteria nếu cần
      const criteria = query.payload as any; // TODO: mapping đúng type nếu có
      const result = await this.auditLogRepo.findByCriteria(criteria);
      // Mapping domain object -> DTO nếu cần
      const items = result.data.map((entry) =>
        AuditLogEntryMapper.toQueryDto(entry)
      );
      this.logger.info("Truy vấn audit logs thành công", {
        total: result.total,
      });
      return {
        success: true,
        error: "",
        details: "",
        data: {
          items,
          total: result.total,
          offset: query.payload.pageNumber,
          limit: query.payload.pageSize,
        },
      };
    } catch (err) {
      this.logger.error("Truy vấn audit logs thất bại", err as Error, {
        payload: query.payload,
      });
      return {
        success: false,
        error: "GET_AUDIT_LOGS_FAILED",
        details: (err as Error).message,
        data: {
          items: [],
          total: 0,
          offset: query.payload.pageNumber,
          limit: query.payload.pageSize,
        },
      };
    }
  }
}
// TODO: Unit test cho handler này
