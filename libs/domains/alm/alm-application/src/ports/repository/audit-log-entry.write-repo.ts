import { AuditLogEntry, IAuditLogEntryProps } from "@ecoma/alm-domain";
import { IWriteRepository, UuidId } from "@ecoma/common-domain";

/**
 * Repository interface cho ghi AuditLogEntry (Command side)
 * @see AuditLogEntry
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface IAuditLogEntryWriteRepo
  extends IWriteRepository<UuidId, IAuditLogEntryProps, AuditLogEntry> {}
