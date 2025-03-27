import { IngestAuditLogCommandDto } from '../../dtos/commands/ingest-audit-log.command.dto';

/**
 * Command object cho use case ingest audit log
 */
export class IngestAuditLogCommand {
  constructor(public readonly payload: IngestAuditLogCommandDto) {}
}
