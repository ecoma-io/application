// TODO: Import AuditLogEntry domain object từ alm-domain khi có
import { v4 as uuidv4 } from "uuid";

import { IngestAuditLogCommandDto } from "../dtos/commands";
import { AuditLogEntryQueryDto } from "../dtos/queries";
// import { AuditLogEntry } from '@ecoma/domains/alm/alm-domain';

export class AuditLogEntryMapper {
  /**
   * Chuyển từ IngestAuditLogCommandDto sang AuditLogEntry domain object (mock)
   * @param dto
   */
  static fromIngestDto(dto: IngestAuditLogCommandDto): any /* AuditLogEntry */ {
    return {
      id: uuidv4(),
      eventId: dto.eventId,
      timestamp: dto.timestamp,
      initiator: dto.initiator,
      boundedContext: dto.boundedContext,
      actionType: dto.actionType,
      category: dto.category,
      severity: dto.severity,
      entityId: dto.entityId,
      entityType: dto.entityType,
      tenantId: dto.tenantId,
      contextData: dto.contextData?.value,
      status: dto.status,
      failureReason: dto.failureReason,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Chuyển từ AuditLogEntry domain object sang DTO cho query
   * @param entry
   */
  static toQueryDto(entry: any /* AuditLogEntry */): AuditLogEntryQueryDto {
    return {
      id: entry.id,
      eventId: entry.eventId,
      timestamp: entry.timestamp,
      initiator: entry.initiator,
      boundedContext: entry.boundedContext,
      actionType: entry.actionType,
      category: entry.category,
      severity: entry.severity,
      entityId: entry.entityId,
      entityType: entry.entityType,
      tenantId: entry.tenantId,
      contextData: entry.contextData,
      status: entry.status,
      failureReason: entry.failureReason,
      createdAt: entry.createdAt,
    };
  }
}
