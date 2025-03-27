import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { NestjsLogger } from "@ecoma/nestjs-logging";

import { AuditLog } from "../../schemas/audit-log.schema";
import { GetAuditLogsQuery } from "../get-audit-logs.query";

/**
 * Handler xử lý query lấy danh sách audit logs
 */
@QueryHandler(GetAuditLogsQuery)
export class GetAuditLogsHandler implements IQueryHandler<GetAuditLogsQuery> {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
    private readonly logger: NestjsLogger
  ) {}

  /**
   * Xử lý query lấy danh sách audit logs
   * @param query Query chứa các tiêu chí tìm kiếm
   * @returns Danh sách audit logs và thông tin phân trang
   */
  async execute(query: GetAuditLogsQuery): Promise<{
    items: AuditLog[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    this.logger.debug("Thực thi query lấy danh sách audit logs", { query });

    const filter: Record<string, unknown> = {};

    if (query.tenantId) {
      filter.tenantId = query.tenantId;
    }
    if (query.initiatorType) {
      filter["initiator.type"] = query.initiatorType;
    }
    if (query.initiatorId) {
      filter["initiator.id"] = query.initiatorId;
    }
    if (query.boundedContext) {
      filter.boundedContext = query.boundedContext;
    }
    if (query.actionType) {
      filter.actionType = query.actionType;
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.severity) {
      filter.severity = query.severity;
    }
    if (query.entityType) {
      filter.entityType = query.entityType;
    }
    if (query.entityId) {
      filter.entityId = query.entityId;
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.timestampFrom || query.timestampTo) {
      filter.timestamp = {
        ...(query.timestampFrom && { $gte: query.timestampFrom }),
        ...(query.timestampTo && { $lte: query.timestampTo }),
      };
    }

    const skip = (query.pageNumber - 1) * query.pageSize;
    const sort: Record<string, 1 | -1> = {
      [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
    };

    const [items, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.pageSize)
        .exec(),
      this.auditLogModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: query.pageNumber,
      pageSize: query.pageSize,
    };
  }
}
