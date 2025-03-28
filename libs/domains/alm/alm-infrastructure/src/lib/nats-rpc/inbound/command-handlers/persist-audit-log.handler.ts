/**
 * @fileoverview Handler xử lý command persist audit log qua NATS
 * @since 1.0.0
 */

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { PersistAuditLogCommand } from '@ecoma/alm-application';

/**
 * Handler xử lý command persist audit log qua NATS
 */
@Controller()
export class PersistAuditLogNatsHandler {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Xử lý command persist audit log
   * @param {any} data - Dữ liệu từ NATS
   */
  @MessagePattern('alm.command.persist_audit_log')
  async handle(data: any): Promise<void> {
    const command = new PersistAuditLogCommand(
      data.eventId,
      new Date(data.timestamp),
      data.initiator,
      data.boundedContext,
      data.actionType,
      data.tenantId,
      data.category,
      data.severity,
      data.entityId,
      data.entityType,
      data.description,
      data.status,
      data.failureReason
    );

    await this.commandBus.execute(command);
  }
}
