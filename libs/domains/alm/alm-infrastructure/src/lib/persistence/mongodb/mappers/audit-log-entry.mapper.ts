/**
 * @fileoverview Mapper chuyển đổi giữa domain model và persistence model cho AuditLogEntry
 * @since 1.0.0
 */

import { AuditLogEntry, AuditLogEntryId, Initiator, AuditContext } from '@ecoma/alm-domain';
import { AuditLogEntryEntity } from '../entities/audit-log-entry.entity';

/**
 * Mapper chuyển đổi giữa domain model và persistence model cho AuditLogEntry
 * @class
 * @since 1.0.0
 */
export class AuditLogEntryMapper {
  /**
   * Chuyển đổi từ persistence model sang domain model
   * @param {AuditLogEntryEntity} entity - Entity từ MongoDB
   * @returns {AuditLogEntry} Domain model tương ứng
   * @example
   * const domainModel = AuditLogEntryMapper.toDomain(entity);
   */
  public static toDomain(entity: AuditLogEntryEntity): AuditLogEntry {
    const auditContext = AuditContext.create({
      boundedContext: entity.boundedContext,
      tenantId: entity.tenantId || '',
      userId: entity.initiator.id || '',
      actionType: entity.actionType,
      entityType: entity.entityType || '',
      entityId: entity.entityId || '',
      timestamp: entity.timestamp,
      metadata: entity.contextData
    });

    return new AuditLogEntry({
      id: AuditLogEntryId.from(entity.id),
      eventId: entity.eventId,
      timestamp: entity.timestamp,
      initiator: Initiator.create({
        type: entity.initiator.type,
        id: entity.initiator.id,
        name: entity.initiator.name,
      }),
      boundedContext: entity.boundedContext,
      actionType: entity.actionType,
      category: entity.category,
      severity: entity.severity,
      entityId: entity.entityId,
      entityType: entity.entityType,
      tenantId: entity.tenantId,
      contextData: auditContext,
      status: entity.status,
      failureReason: entity.failureReason,
      createdAt: entity.createdAt
    });
  }

  /**
   * Chuyển đổi từ domain model sang persistence model
   * @param {AuditLogEntry} domain - Domain model cần chuyển đổi
   * @returns {Partial<AuditLogEntryEntity>} Entity tương ứng cho MongoDB
   * @example
   * const entity = AuditLogEntryMapper.toPersistence(domainModel);
   */
  public static toPersistence(domain: AuditLogEntry): Partial<AuditLogEntryEntity> {
    return {
      id: domain.getIdentifier(),
      eventId: domain.eventId,
      timestamp: domain.timestamp,
      initiator: {
        type: domain.initiator.type,
        id: domain.initiator.id,
        name: domain.initiator.name,
      },
      boundedContext: domain.boundedContext,
      actionType: domain.actionType,
      category: domain.category,
      severity: domain.severity,
      entityId: domain.entityId,
      entityType: domain.entityType,
      tenantId: domain.tenantId,
      contextData: domain.contextData.value,
      status: domain.status,
      failureReason: domain.failureReason,
      createdAt: domain.createdAt,
    };
  }
}
