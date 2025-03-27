import { ICommand } from "@ecoma/common-application";
import { IngestAuditLogCommandDto } from "../../dtos/commands/ingest-audit-log.command.dto";

/**
 * Command object cho use case ingest audit log
 */
export class IngestAuditLogCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: IngestAuditLogCommandDto) {}
}
