import "reflect-metadata";

import { AuditLogIngestionApplicationService } from "@ecoma/alm-application";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { Injectable } from "@nestjs/common";
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
    private readonly mapper: AuditLogEventMapper
  ) {}

  async handle(event: AuditLogRequestedEvent): Promise<void> {
    const auditLogDto = this.mapper.toDto(event);
    await this.auditLogIngestionService.handleAuditLogRequestedEvent(
      auditLogDto
    );
  }
}
