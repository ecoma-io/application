/**
 * @fileoverview Handler xử lý command lưu trữ audit log
 * @since 1.0.0
 */

import { ICommandHandler } from '@ecoma/common-application';
import { AuditLogService } from '../services/audit-log.service';
import { PersistAuditLogCommand } from '../commands/persist-audit-log.command';

/**
 * Handler xử lý command lưu trữ audit log
 */
export class PersistAuditLogHandler implements ICommandHandler<PersistAuditLogCommand> {
  /**
   * Khởi tạo một instance của PersistAuditLogHandler
   * @param {AuditLogService} auditLogService - Service xử lý audit log
   */
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Xử lý command lưu trữ audit log
   * @param {PersistAuditLogCommand} command - Command cần xử lý
   * @returns {Promise<void>}
   */
  async handle(command: PersistAuditLogCommand): Promise<void> {
    await this.auditLogService.persistAuditLogEntry(command);
  }
}
