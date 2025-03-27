import { AuditLogEntry } from "@ecoma/alm-domain";
import {
  AbstractLogger,
  CusorBasedPaginatedDTO,
  OffsetBasedPaginatedDTO,
} from "@ecoma/common-application";
import { AuditLogQueryDto } from "../../dto";
import { IAuditLogReadRepository } from "../../ports";

export class GetAuditLogsQueryHandler {
  constructor(
    private readonly auditLogReadRepo: IAuditLogReadRepository,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(GetAuditLogsQueryHandler.name);
  }

  async execute(
    query: AuditLogQueryDto
  ): Promise<
    | CusorBasedPaginatedDTO<AuditLogEntry>
    | OffsetBasedPaginatedDTO<AuditLogEntry>
  > {
    const logId = `get-audit-logs_${Date.now()}`;

    try {
      this.logger.info(`Querying audit logs [${logId}]`, {
        filters: Object.keys(query.filters || {}).length,
        paginationType: query.pagination?.paginationType,
      });

      this.logger.debug(`Query details [${logId}]`, {
        filters: query.filters,
        sorts: query.sorts,
      });

      const result = await this.auditLogReadRepo.find(query);

      this.logger.info(
        `Retrieved ${result.items.length} audit logs [${logId}]`,
        {
          total: result.total,
        }
      );

      // Convert domain objects to plain objects to ensure all properties are serialized correctly
      const plainItems = result.items.map((item) => ({
        id: item.id.toString(),
        timestamp: item.timestamp,
        initiator: {
          type: item.initiator.type,
          name: item.initiator.name,
          id: item.initiator.id,
          ipAddress: item.initiator.ipAddress,
          userAgent: item.initiator.userAgent,
        },
        boundedContext: item.boundedContext,
        actionType: item.actionType,
        category: item.category,
        entityId: item.entityId,
        entityType: item.entityType,
        tenantId: item.tenantId,
        contextData: item.contextData ? item.contextData.getAll() : undefined,
      }));

      if (query.pagination?.paginationType === "cursor") {
        return {
          success: true,
          data: plainItems,
          total: result.total,
          afterCursor: result.afterCursor || null,
          beforeCusor: result.beforeCursor || null,
        } as CusorBasedPaginatedDTO<any>;
      } else {
        return {
          success: true,
          data: plainItems,
          total: result.total,
        } as OffsetBasedPaginatedDTO<any>;
      }
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to query audit logs [${logId}] - ${error.message}`
      );

      throw error;
    }
  }
}
