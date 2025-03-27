import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { NestjsLogger } from "@ecoma/nestjs-logging";

import { AuditLog } from "../../schemas/audit-log.schema";
import { PersistAuditLogCommand } from "../persist-audit-log.command";

/**
 * Handler xử lý command lưu audit log
 */
@CommandHandler(PersistAuditLogCommand)
export class PersistAuditLogHandler
  implements ICommandHandler<PersistAuditLogCommand>
{
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
    private readonly logger: NestjsLogger
  ) {}

  /**
   * Xử lý command lưu audit log
   * @param command Command chứa thông tin audit log cần lưu
   */
  async execute(command: PersistAuditLogCommand): Promise<void> {
    this.logger.debug("Thực thi command lưu audit log", { command });

    const auditLog = new this.auditLogModel({
      tenantId: command.tenantId,
      initiator: command.initiator,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      category: command.category,
      severity: command.severity,
      entityType: command.entityType,
      entityId: command.entityId,
      changes: command.changes,
      contextData: command.contextData,
      status: command.status,
      failureReason: command.failureReason,
      eventId: command.eventId,
      timestamp: command.issuedAt,
    });

    await auditLog.save();
  }
}
