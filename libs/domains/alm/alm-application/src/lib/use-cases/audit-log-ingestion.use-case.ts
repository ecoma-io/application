/**
 * @fileoverview Use case xử lý việc nhập audit log vào hệ thống
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { ICommandBus } from '@ecoma/common-application';
import { PersistAuditLogCommand } from '../commands/persist-audit-log.command';
import { Initiator } from '@ecoma/alm-domain';

/**
 * Use case xử lý việc nhập audit log vào hệ thống
 */
@Injectable()
export class AuditLogIngestionUseCase {
  /**
   * Khởi tạo một instance của AuditLogIngestionUseCase
   * @param {ICommandBus} commandBus - Command bus để gửi command
   */
  constructor(private readonly commandBus: ICommandBus) {}

  /**
   * Thực hiện nhập một audit log vào hệ thống
   * @param {string} eventId - ID của event
   * @param {Date} timestamp - Thời điểm xảy ra event
   * @param {Initiator} initiator - Người thực hiện hành động
   * @param {string} boundedContext - Bounded context của event
   * @param {string} actionType - Loại hành động
   * @param {string} [category] - Danh mục của event
   * @param {string} [severity] - Mức độ nghiêm trọng
   * @param {string} [entityId] - ID của entity liên quan
   * @param {string} [entityType] - Loại entity
   * @param {string} [description] - Mô tả chi tiết
   * @param {string} [status] - Trạng thái của event (SUCCESS/FAILURE)
   * @param {string} [failureReason] - Lý do thất bại nếu có
   * @returns {Promise<void>}
   */
  async ingest(
    eventId: string,
    timestamp: Date,
    initiator: Initiator,
    boundedContext: string,
    actionType: string,
    category?: string,
    severity?: string,
    entityId?: string,
    entityType?: string,
    description?: string,
    status?: string,
    failureReason?: string
  ): Promise<void> {
    const command = new PersistAuditLogCommand(
      eventId,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      undefined, // tenantId
      category,
      severity,
      entityId,
      entityType,
      description,
      status,
      failureReason
    );

    await this.commandBus.execute(command);
  }
}
