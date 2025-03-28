/**
 * @fileoverview Handler xử lý command lưu trữ audit log
 * @since 1.0.0
 */

import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  AuditLogEntryPersistedEvent,
} from "@ecoma/alm-domain";
import { ICommandHandler } from "@ecoma/common-application";
import { IDomainEventPublisher } from "../../interfaces/message-broker/domain-event.publisher";
import { IAuditLogRepository } from "../../interfaces/persistence/audit-log.repository";
import { PersistAuditLogCommand } from "../persist-audit-log.command";

/**
 * Handler xử lý command lưu trữ audit log
 */
export class PersistAuditLogHandler
  implements ICommandHandler<PersistAuditLogCommand>
{
  /**
   * Khởi tạo một instance của PersistAuditLogHandler
   * @param {IAuditLogRepository} auditLogRepository - Repository xử lý audit log
   * @param {IDomainEventPublisher} eventPublisher - Publisher xử lý domain event
   */
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  /**
   * Xử lý command lưu trữ audit log
   * @param {PersistAuditLogCommand} command - Command cần xử lý
   * @returns {Promise<void>}
   */
  async handle(command: PersistAuditLogCommand): Promise<void> {
    const contextData = AuditContext.create({
      boundedContext: command.boundedContext,
      tenantId: command.tenantId || "",
      userId: command.initiator.id || "",
      actionType: command.actionType,
      entityType: command.entityType || "",
      entityId: command.entityId || "",
      timestamp: command.timestamp,
      metadata: { isSuccess: command.isSuccess || false },
    });

    // Tạo AuditLogEntry từ command
    const auditLogEntry = AuditLogEntry.create({
      id: AuditLogEntryId.create(),
      eventId: command.eventId,
      timestamp: command.timestamp,
      initiator: command.initiator,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      category: command.category || null,
      severity: command.severity || null,
      entityId: command.entityId || null,
      entityType: command.entityType || null,
      tenantId: command.tenantId || null,
      contextData,
      status: command.isSuccess ? "SUCCESS" : "FAILURE",
      failureReason: command.failureReason || null,
    });

    // Lưu trữ audit log entry
    await this.auditLogRepository.save(auditLogEntry);

    // Phát event xác nhận đã lưu trữ thành công
    const persistedEvent = new AuditLogEntryPersistedEvent(
      new Date(),
      undefined,
      auditLogEntry.getIdentifier()
    );

    await this.eventPublisher.publish(persistedEvent);
  }
}
