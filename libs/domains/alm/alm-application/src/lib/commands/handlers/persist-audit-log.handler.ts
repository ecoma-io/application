/**
 * @fileoverview Handler xử lý command lưu trữ audit log
 * @since 1.0.0
 */

import { ICommandHandler } from '@ecoma/common-application';
import { AuditLogEntry, AuditLogEntryId, AuditLogEntryPersistedEvent, AuditContext } from '@ecoma/alm-domain';
import { PersistAuditLogCommand } from '../persist-audit-log.command';
import { IDomainEventPublisher } from '../../interfaces/message-broker/domain-event.publisher';
import { IAuditLogRepository } from '../../interfaces/persistence/audit-log.repository';

/**
 * Handler xử lý command lưu trữ audit log
 */
export class PersistAuditLogHandler implements ICommandHandler<PersistAuditLogCommand> {
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
    // Tạo AuditLogEntry từ command
    const auditLogEntry = AuditLogEntry.create(
      AuditLogEntryId.create(),
      command.eventId,
      command.timestamp,
      command.initiator,
      command.boundedContext,
      command.actionType,
      command.category || null,
      command.severity || null,
      command.entityId || null,
      command.entityType || null,
      command.tenantId || null,
      AuditContext.create({
        boundedContext: command.boundedContext,
        tenantId: command.tenantId || '',
        userId: command.initiator.id || '',
        actionType: command.actionType,
        entityType: command.entityType || '',
        entityId: command.entityId || '',
        timestamp: command.timestamp,
        metadata: { isSuccess: command.isSuccess || false }
      }),
      command.isSuccess ? 'SUCCESS' : 'FAILURE',
      command.failureReason || null
    );

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
