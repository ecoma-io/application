/**
 * @fileoverview Service xử lý audit log
 * @since 1.0.0
 */

import { ICursorAheadPagination, ICursorBackPagination, IOffsetPagination } from '@ecoma/common-domain';
import { IAuditLogReadRepository, IAuditLogWriteRepository } from '../repositories';
import { AuditLogEntry } from '../aggregates';
import { Initiator, AuditContext, AuditLogEntryId } from '../value-objects';
import { IAuditLogEntrySpecification } from '../specifications';

/**
 * Service xử lý audit log
 */
export class AuditLogService {
  constructor(
    private readonly auditLogEntryReadRepository: IAuditLogReadRepository,
    private readonly auditLogEntryWriteRepository: IAuditLogWriteRepository,
  ) { }

  /**
   * Lưu trữ một bản ghi audit log
   * @param {Object} params - Các tham số để tạo audit log
   * @param {string} params.id - ID của bản ghi
   * @param {string} params.eventId - ID của sự kiện
   * @param {Date} params.timestamp - Thời gian xảy ra
   * @param {Initiator} params.initiator - Người thực hiện
   * @param {string} params.boundedContext - Bounded context
   * @param {string} params.actionType - Loại hành động
   * @param {string} [params.category] - Danh mục
   * @param {string} [params.severity] - Mức độ nghiêm trọng
   * @param {string} [params.entityId] - ID của entity
   * @param {string} [params.entityType] - Loại entity
   * @param {string} [params.tenantId] - ID của tenant
   * @param {AuditContext} [params.contextData] - Dữ liệu ngữ cảnh
   * @param {string} params.status - Trạng thái
   * @param {string} [params.failureReason] - Lý do thất bại
   * @returns {Promise<void>}
   */
  async persistAuditLogEntry(params: {
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
    status: string;
    failureReason?: string;
  }): Promise<void> {
    const contextData = params.contextData ?? AuditContext.create({
      boundedContext: params.boundedContext,
      tenantId: params.tenantId ?? '',
      userId: params.initiator.id ?? '',
      actionType: params.actionType,
      entityType: params.entityType ?? '',
      entityId: params.entityId ?? '',
      timestamp: params.timestamp
    });

    const auditLogEntry = new AuditLogEntry({
      id: AuditLogEntryId.from(params.id),
      eventId: params.eventId,
      timestamp: params.timestamp,
      initiator: params.initiator,
      boundedContext: params.boundedContext,
      actionType: params.actionType,
      category: params.category ?? null,
      severity: params.severity ?? null,
      entityId: params.entityId ?? null,
      entityType: params.entityType ?? null,
      tenantId: params.tenantId ?? null,
      contextData,
      status: params.status,
      failureReason: params.failureReason ?? null
    });

    await this.auditLogEntryWriteRepository.save(auditLogEntry);
  }

  /**
   * Tìm kiếm các bản ghi audit log theo tiêu chí
   * @param {IAuditLogEntrySpecification} query - Tiêu chí tìm kiếm
   * @param {IOffsetPagination | ICursorAheadPagination | ICursorBackPagination} pagination - Thông tin phân trang
   * @returns {Promise<{ items: AuditLogEntry[]; total: number; }>} Kết quả tìm kiếm
   */
  async findAuditLogs(
    query: IAuditLogEntrySpecification,
    pagination: IOffsetPagination | ICursorAheadPagination | ICursorBackPagination
  ) {
    if ('offset' in pagination) {
      return this.auditLogEntryReadRepository.findWithOffsetPagination(query, pagination);
    } else {
      return this.auditLogEntryReadRepository.findWithCursorPagination(query, pagination);
    }
  }
}
