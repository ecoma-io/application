/**
 * @fileoverview Service xử lý nhận và lưu trữ audit log
 * @since 1.0.0
 */

import { AuditLogEntry } from '../aggregates';
import { AuditLogEntryId, Initiator, AuditContext } from '../value-objects';
import { IAuditLogWriteRepository } from '../repositories';

/**
 * Service xử lý nhận và lưu trữ audit log
 */
export class AuditLogIngestionService {
  constructor(
    private readonly auditLogWriteRepository: IAuditLogWriteRepository
  ) {}

  /**
   * Xử lý và lưu trữ một sự kiện audit log
   * @param {Object} event - Sự kiện audit log cần xử lý
   * @param {string} event.id - ID của sự kiện
   * @param {string} event.eventId - ID của sự kiện gốc
   * @param {Date} event.timestamp - Thời gian xảy ra
   * @param {Initiator} event.initiator - Người thực hiện
   * @param {string} event.boundedContext - Bounded context
   * @param {string} event.actionType - Loại hành động
   * @param {string} [event.category] - Danh mục
   * @param {string} [event.severity] - Mức độ nghiêm trọng
   * @param {string} [event.entityId] - ID của entity
   * @param {string} [event.entityType] - Loại entity
   * @param {string} [event.tenantId] - ID của tenant
   * @param {AuditContext} [event.contextData] - Dữ liệu ngữ cảnh
   * @returns {Promise<void>}
   */
  async ingest(event: {
    id: string;
    eventId: string;
    timestamp: Date;
    initiator: Initiator;
    boundedContext: string;
    actionType: string;
    category?: string;
    severity?: string;
    entityId?: string;
    entityType?: string;
    tenantId?: string;
    contextData?: AuditContext;
  }): Promise<void> {
    const auditLogEntry = AuditLogEntry.create(
      AuditLogEntryId.from(event.id),
      event.eventId,
      event.timestamp,
      event.initiator,
      event.boundedContext,
      event.actionType,
      event.category ?? null,
      event.severity ?? null,
      event.entityId ?? null,
      event.entityType ?? null,
      event.tenantId ?? null,
      event.contextData ?? AuditContext.create({
        boundedContext: event.boundedContext,
        tenantId: event.tenantId ?? '',
        userId: event.initiator.id ?? '',
        actionType: event.actionType,
        entityType: event.entityType ?? '',
        entityId: event.entityId ?? '',
        timestamp: event.timestamp
      }),
      'Success',
      null
    );

    await this.auditLogWriteRepository.save(auditLogEntry);
  }
}
