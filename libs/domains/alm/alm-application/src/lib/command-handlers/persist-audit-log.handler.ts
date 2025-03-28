/**
 * @fileoverview Handler xử lý command lưu trữ audit log
 * @since 1.0.0
 */

import { ICommandHandler, ILogger } from "@ecoma/common-application";
import { PersistAuditLogCommand } from "../commands/persist-audit-log.command";
import { AuditLogService } from "../services/audit-log.service";

/**
 * Handler xử lý command lưu trữ audit log
 */
export class PersistAuditLogHandler
  implements ICommandHandler<PersistAuditLogCommand>
{
  /**
   * Khởi tạo một instance của PersistAuditLogHandler
   * @param {AuditLogService} auditLogService - Service xử lý audit log
   * @param {ILogger} logger - Logger để ghi log
   */
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý command lưu trữ audit log
   * @param {PersistAuditLogCommand} command - Command cần xử lý
   * @returns {Promise<void>}
   */
  async handle(command: PersistAuditLogCommand): Promise<void> {
    this.logger.debug("Received command to persist audit log", {
      eventId: command.eventId,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      entityType: command.entityType,
      entityId: command.entityId,
    });

    try {
      const startTime = Date.now();
      await this.auditLogService.persistAuditLogEntry(command);
      const elapsedTime = Date.now() - startTime;

      this.logger.info("Successfully processed command to persist audit log", {
        eventId: command.eventId,
        boundedContext: command.boundedContext,
        actionType: command.actionType,
        elapsedTimeMs: elapsedTime,
      });
    } catch (error) {
      this.logger.error(
        "Error processing audit log persistence command",
        error instanceof Error ? error : new Error(String(error)),
        {
          eventId: command.eventId,
          boundedContext: command.boundedContext,
          actionType: command.actionType,
        }
      );
      throw error;
    }
  }
}
