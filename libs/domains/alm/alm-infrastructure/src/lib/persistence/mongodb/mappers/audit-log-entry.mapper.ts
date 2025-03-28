/**
 * @fileoverview Mapper chuyển đổi giữa domain model và persistence model cho AuditLogEntry
 * @since 1.0.0
 */

import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  Initiator,
} from "@ecoma/alm-domain";
import { Logger } from "@nestjs/common";
import { AuditLogEntryEntity } from "../entities/audit-log-entry.entity";

/**
 * Mapper chuyển đổi giữa domain model và persistence model cho AuditLogEntry
 * @class
 * @since 1.0.0
 */
export class AuditLogEntryMapper {
  private static readonly logger = new Logger("AuditLogEntryMapper");

  /**
   * Chuyển đổi từ persistence model sang domain model
   * @param {AuditLogEntryEntity} entity - Entity từ MongoDB
   * @returns {AuditLogEntry} Domain model tương ứng
   * @example
   * const domainModel = AuditLogEntryMapper.toDomain(entity);
   */
  public static toDomain(entity: AuditLogEntryEntity): AuditLogEntry {
    // Ensure resource is correctly mapped with all fields
    const resource = entity.resource
      ? {
          type: entity.resource.type || "unknown",
          id: entity.resource.id || "unknown-id",
          name: entity.resource.name || "Unknown Resource",
        }
      : undefined;

    if (entity.resource) {
      this.logger.debug(
        `Resource from entity: ${JSON.stringify(entity.resource)}`
      );
      this.logger.debug(
        `Mapped resource for domain: ${JSON.stringify(resource)}`
      );
    }

    // Đảm bảo initiator có đủ các trường bắt buộc
    const initiatorName =
      entity.initiator && entity.initiator.name
        ? entity.initiator.name
        : "Unknown";
    const initiatorType =
      entity.initiator && entity.initiator.type
        ? entity.initiator.type
        : "system";
    const initiatorId =
      entity.initiator && entity.initiator.id ? entity.initiator.id : null;

    const auditContext = AuditContext.create({
      boundedContext: entity.boundedContext,
      tenantId: entity.tenantId || "",
      userId: initiatorId || "",
      actionType: entity.actionType || entity.action || "",
      entityType:
        entity.entityType || (entity.resource ? entity.resource.type : ""),
      entityId: entity.entityId || (entity.resource ? entity.resource.id : ""),
      timestamp: entity.timestamp,
      metadata: entity.contextData || entity.context || {},
    });

    return new AuditLogEntry({
      id: AuditLogEntryId.from(entity.id),
      eventId: entity.eventId,
      timestamp: entity.timestamp,
      initiator: Initiator.create({
        type: initiatorType,
        id: initiatorId,
        name: initiatorName,
      }),
      boundedContext: entity.boundedContext,
      actionType: entity.actionType,
      category: entity.category,
      severity: entity.severity,
      entityId: entity.entityId,
      entityType: entity.entityType,
      tenantId: entity.tenantId,
      contextData: auditContext,
      status: entity.status || "Success",
      failureReason: entity.failureReason,
      createdAt: entity.createdAt,
      // Trường bổ sung cho E2E test
      action: entity.action,
      resource: resource, // Use our safely mapped resource
      context: entity.context,
      changes: entity.changes,
      metadata: entity.metadata,
    });
  }

  /**
   * Chuyển đổi từ domain model sang persistence model
   * @param {AuditLogEntry} domain - Domain model cần chuyển đổi
   * @returns {Partial<AuditLogEntryEntity>} Entity tương ứng cho MongoDB
   * @example
   * const entity = AuditLogEntryMapper.toPersistence(domainModel);
   */
  public static toPersistence(
    domain: AuditLogEntry
  ): Partial<AuditLogEntryEntity> {
    // Ensure resource is correctly mapped to persistence
    const resource = domain.resource
      ? {
          type: domain.resource.type || "unknown",
          id: domain.resource.id || "unknown-id",
          name: domain.resource.name || "Unknown Resource",
        }
      : undefined;

    if (domain.resource) {
      this.logger.debug(
        `Resource from domain: ${JSON.stringify(domain.resource)}`
      );
      this.logger.debug(
        `Mapped resource for persistence: ${JSON.stringify(resource)}`
      );
    }

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
      // Trường bổ sung cho E2E test
      action: domain.action,
      resource: resource, // Use our safely mapped resource
      context: domain.context,
      changes: domain.changes,
      metadata: domain.metadata,
    };
  }
}
