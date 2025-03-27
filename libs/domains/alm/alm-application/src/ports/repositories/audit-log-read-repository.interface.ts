import {
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogEntryProps,
} from "@ecoma/alm-domain";
import { IReadRepository } from "@ecoma/common-application";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface IAuditLogReadRepository
  extends IReadRepository<
    AuditLogEntryId,
    IAuditLogEntryProps,
    AuditLogEntry
  > {}
