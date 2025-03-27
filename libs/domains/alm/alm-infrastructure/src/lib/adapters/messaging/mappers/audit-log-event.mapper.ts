import {
  AuditLogStatus,
  IngestAuditLogCommandDto,
} from "@ecoma/alm-application";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { Injectable } from "@nestjs/common";

/**
 * Mapper để chuyển đổi AuditLogRequestedEvent thành IngestAuditLogCommandDto
 */
@Injectable()
export class AuditLogEventMapper {
  toDto(event: AuditLogRequestedEvent): IngestAuditLogCommandDto {
    return {
      timestamp: event.timestamp.toISOString(),
      initiator: {
        type: event.initiator.type,
        id: event.initiator.id,
        name: event.initiator.name,
      },
      boundedContext: event.boundedContext,
      actionType: event.actionType,
      category: event.category,
      severity: event.severity,
      entityId: event.entityId,
      entityType: event.entityType,
      tenantId: event.tenantId,
      contextData: event.contextData ? { value: event.contextData } : undefined,
      status:
        event.status === "Success"
          ? AuditLogStatus.Success
          : AuditLogStatus.Failure,
      failureReason: event.failureReason,
      eventId: event.eventId,
      issuedAt: event.issuedAt.toISOString(),
    };
  }
}
