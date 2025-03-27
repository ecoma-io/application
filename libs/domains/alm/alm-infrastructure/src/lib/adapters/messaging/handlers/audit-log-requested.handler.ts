import "reflect-metadata";

import {
  AuditLogIngestionApplicationService,
  AuditLogQueryApplicationService,
  GetAuditLogsQuery,
} from "@ecoma/alm-application";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { ILogger } from "@ecoma/common-domain";
import { Inject, Injectable } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { AuditLogEventMapper } from "../mappers/audit-log-event.mapper";

/**
 * Handler xử lý sự kiện AuditLogRequestedEvent
 */
@Injectable()
@EventsHandler(AuditLogRequestedEvent)
export class AuditLogRequestedHandler
  implements IEventHandler<AuditLogRequestedEvent>
{
  constructor(
    private readonly auditLogIngestionService: AuditLogIngestionApplicationService,
    private readonly auditLogQueryService: AuditLogQueryApplicationService,
    private readonly mapper: AuditLogEventMapper,
    @Inject("ILogger") private readonly logger: ILogger
  ) {}

  async handle(event: AuditLogRequestedEvent): Promise<void> {
    try {
      if (event.actionType === "AuditLog.Requested") {
        // Handle query operation
        const contextData = event.contextData || {};
        const query = new GetAuditLogsQuery({
          pageNumber: Number(contextData["pageNumber"]) || 0,
          pageSize: Number(contextData["pageSize"]) || 10,
          tenantId: contextData["tenantId"] as string | undefined,
        });

        this.logger.info("Processing audit log query request", {
          userId: event.initiator.id,
          query: query.payload,
        });

        await this.auditLogQueryService.getAuditLogs(
          {
            id: event.initiator.id || "",
            roles: Array.isArray(contextData["roles"])
              ? (contextData["roles"] as string[])
              : [],
            tenantId: contextData["tenantId"] as string | undefined,
          },
          query
        );

        this.logger.info("Audit log query processed successfully");
      } else {
        // Handle ingestion operation
        const auditLogDto = this.mapper.toDto(event);
        await this.auditLogIngestionService.handleAuditLogRequestedEvent(
          auditLogDto
        );
      }
    } catch (error) {
      this.logger.error("Error processing audit log event", error as Error);
      throw error;
    }
  }
}
