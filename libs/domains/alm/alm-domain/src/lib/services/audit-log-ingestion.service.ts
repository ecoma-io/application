/**
 * @fileoverview Service xử lý nhận và lưu trữ audit log
 * @since 1.0.0
 */

import { AuditLogEntry } from "../aggregates";
import { IAuditLogWriteRepository } from "../repositories";
import { AuditContext, AuditLogEntryId, Initiator } from "../value-objects";

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
   * @param {string} [event.id] - ID tùy chọn (nếu không cung cấp thì sẽ tự động tạo)
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
   * @param {string} [event.action] - Hành động (create, update, delete)
   * @param {Object} [event.resource] - Tài nguyên bị tác động
   * @param {Object} [event.context] - Ngữ cảnh cho E2E test
   * @param {Array} [event.changes] - Danh sách thay đổi
   * @param {Object} [event.metadata] - Metadata bổ sung
   * @returns {Promise<void>}
   */
  async ingest(event: {
    id?: string;
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
    action?: string;
    resource?: {
      type: string;
      id: string;
      name: string;
    };
    context?: Record<string, any>;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const contextData =
      event.contextData ??
      AuditContext.create({
        boundedContext: event.boundedContext,
        tenantId: event.tenantId ?? "",
        userId: event.initiator.id ?? "",
        actionType: event.actionType,
        entityType: event.entityType ?? "",
        entityId: event.entityId ?? "",
        timestamp: event.timestamp,
      });

    // Tạo ID nếu không được cung cấp
    const id = event.id
      ? AuditLogEntryId.from(event.id)
      : AuditLogEntryId.create();

    const auditLogEntry = AuditLogEntry.create({
      id: id,
      eventId: event.eventId,
      timestamp: event.timestamp,
      initiator: event.initiator,
      boundedContext: event.boundedContext,
      actionType: event.actionType,
      category: event.category ?? null,
      severity: event.severity ?? null,
      entityId: event.entityId ?? null,
      entityType: event.entityType ?? null,
      tenantId: event.tenantId ?? null,
      contextData,
      status: "Success",
      failureReason: null,
      action: event.action,
      resource: event.resource,
      context: event.context,
      changes: event.changes,
      metadata: event.metadata,
    });

    await this.auditLogWriteRepository.save(auditLogEntry);
  }
}
