import { IReadRepository } from '@ecoma/common-domain';
import { AuditLogEntry } from '../aggregates';
import { AuditLogEntryId } from '../value-objects';

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IAuditLogReadRepository extends IReadRepository<AuditLogEntryId, AuditLogEntry> {

}
