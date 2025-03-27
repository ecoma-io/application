import { ICommandHandler, IGenericResult } from "@ecoma/common-application";
import { ILogger } from "@ecoma/common-domain";
import { validateSync } from "class-validator";

import { AuditLogEntryMapper } from "../../mappers";
import { IAuditLogEntryWriteRepo } from "../../ports/repository";
import { IngestAuditLogCommand } from "./ingest-audit-log.command";

export class IngestAuditLogCommandHandler
  implements
    ICommandHandler<IngestAuditLogCommand, IGenericResult<string, string>>
{
  constructor(
    private readonly auditLogRepo: IAuditLogEntryWriteRepo,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý ingest audit log
   * @param command
   */
  async handle(
    command: IngestAuditLogCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.debug("Starting to process IngestAuditLogCommand", {
      payload: command.payload,
    });
    // Validate DTO
    const errors = validateSync(command.payload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      this.logger.warn("Invalid audit log ingest payload", { errors });
      return {
        success: false,
        error: "INVALID_PAYLOAD",
        details: errors
          .map((e) => Object.values(e.constraints || {}).join(", "))
          .join("; "),
        data: "",
      };
    }
    try {
      // Mapping từ DTO sang AuditLogEntry domain object
      const auditLogEntry = AuditLogEntryMapper.fromIngestDto(command.payload);
      await this.auditLogRepo.save(auditLogEntry);
      this.logger.info("Successfully ingested audit log");
      return {
        success: true,
        error: "",
        details: "",
        data: auditLogEntry.id ?? "audit-log-id", // TODO: get actual id from domain object
      };
    } catch (err) {
      this.logger.error("Failed to ingest audit log", err as Error, {
        payload: command.payload,
      });
      return {
        success: false,
        error: "INGEST_AUDIT_LOG_FAILED",
        details: (err as Error).message,
        data: "",
      };
    }
  }
}
// TODO: Unit test for this handler
