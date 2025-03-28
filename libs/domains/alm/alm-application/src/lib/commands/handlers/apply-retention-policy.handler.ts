/**
 * @fileoverview Handler xử lý command áp dụng chính sách lưu trữ
 * @since 1.0.0
 */

import { ICommandHandler } from '@ecoma/common-application';
import { ApplyRetentionPolicyCommand } from '../apply-retention-policy.command';
import { IAuditLogRepository } from '../../interfaces/persistence/audit-log.repository';
import { AuditLogRetentionAppliedEvent } from '@ecoma/alm-domain';
import { IDomainEventPublisher } from '../../interfaces/message-broker/domain-event.publisher';

/**
 * Handler xử lý command áp dụng chính sách lưu trữ
 */
export class ApplyRetentionPolicyHandler implements ICommandHandler<ApplyRetentionPolicyCommand> {
  /**
   * Khởi tạo một instance của ApplyRetentionPolicyHandler
   * @param {IAuditLogRepository} auditLogRepository - Repository xử lý audit log
   * @param {IDomainEventPublisher} eventPublisher - Publisher xử lý domain event
   */
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  /**
   * Xử lý command áp dụng chính sách lưu trữ
   * @param {ApplyRetentionPolicyCommand} command - Command cần xử lý
   * @returns {Promise<void>}
   */
  async handle(command: ApplyRetentionPolicyCommand): Promise<void> {
    const { policy, dryRun } = command;
    const now = new Date();
    let totalDeleted = 0;

    // Xử lý từng rule trong chính sách
    const rules = policy.rules;
    // Process all rules as a batch instead of individually
    // Tìm và xóa các bản ghi cũ hơn thời điểm giới hạn
    const oldRecords = await this.auditLogRepository.findOlderThan(now);
    const recordsToDelete = oldRecords.filter(record =>
      policy.shouldDelete(
        record.boundedContext,
        record.createdAt,
        record.actionType,
        record.entityType || undefined,
        record.tenantId || undefined
      )
    );

    if (!dryRun) {
      await this.auditLogRepository.deleteMany(recordsToDelete.map(r => r.eventId).filter((id): id is string => id !== null));
    }
    totalDeleted += recordsToDelete.length;

    // Phát event xác nhận đã áp dụng retention policy
    const retentionEvent = new AuditLogRetentionAppliedEvent(
      policy.getIdentifier(),
      totalDeleted,
      now,
      now,
      { id: policy.getIdentifier() }
    );

    await this.eventPublisher.publish(retentionEvent);
  }
}
