import {
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogEntryProps,
} from "@ecoma/alm-domain";
import { IWriteRepository } from "@ecoma/common-application";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface IAuditLogWriteRepository
  extends IWriteRepository<
    AuditLogEntryId,
    IAuditLogEntryProps,
    AuditLogEntry
  > {}
