import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  Initiator,
  InitiatorType,
} from "@ecoma/alm-domain";

import { AuditLogEntity } from "../entities/audit-log.entity";

/**
 * Mapper chuyển đổi giữa AuditLog domain object và MongoDB entity
 */
export class AuditLogMapper {
  /**
   * Chuyển từ domain object sang MongoDB entity
   */
  static toPersistence(auditLog: AuditLogEntry): Partial<AuditLogEntity> {
    const entity: Partial<AuditLogEntity> = {
      id: auditLog.id.value,
      timestamp: auditLog.timestamp,
      initiator: {
        type: auditLog.initiator.type,
        id: auditLog.initiator.id,
        name: auditLog.initiator.name,
        ipAddress: auditLog.initiator.ipAddress,
        userAgent: auditLog.initiator.userAgent,
      },
      boundedContext: auditLog.boundedContext,
      actionType: auditLog.actionType,
      status: auditLog.status,
      createdAt: auditLog.createdAt,
    };

    // Optional fields
    if (auditLog.category) entity.category = auditLog.category;
    if (auditLog.severity) entity.severity = auditLog.severity;
    if (auditLog.entityId) entity.entityId = auditLog.entityId;
    if (auditLog.entityType) entity.entityType = auditLog.entityType;
    if (auditLog.tenantId) entity.tenantId = auditLog.tenantId;
    if (auditLog.contextData)
      entity.contextData = auditLog.contextData.getAll();
    if (auditLog.errorMessage) entity.errorMessage = auditLog.errorMessage;
    if (auditLog.processedAt) entity.processedAt = auditLog.processedAt;

    return entity;
  }

  /**
   * Chuyển từ MongoDB entity sang domain object
   */
  static toDomain(entity: AuditLogEntity): AuditLogEntry {
    const initiator = entity.initiator as Record<string, unknown>;
    return new AuditLogEntry({
      id: new AuditLogEntryId(entity.id),
      timestamp: entity.timestamp,
      initiator: new Initiator({
        type: initiator["type"] as InitiatorType,
        id: initiator["id"] as string | undefined,
        name: initiator["name"] as string | undefined,
        ipAddress: initiator["ipAddress"] as string | undefined,
        userAgent: initiator["userAgent"] as string | undefined,
      }),
      boundedContext: entity.boundedContext,
      actionType: entity.actionType,
      category: entity.category,
      severity: entity.severity,
      entityId: entity.entityId,
      entityType: entity.entityType,
      tenantId: entity.tenantId,
      contextData: entity.contextData
        ? new AuditContext(entity.contextData)
        : undefined,
      status: entity.status,
      errorMessage: entity.errorMessage,
      processedAt: entity.processedAt,
      createdAt: entity.createdAt,
    });
  }
}
