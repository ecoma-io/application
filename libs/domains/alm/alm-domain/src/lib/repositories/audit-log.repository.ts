import { IReadRepository, IWriteRepository } from '@ecoma/common-domain';
import { AuditLogEntry } from '../aggregates';
import { AuditLogEntryId } from '../value-objects';

export interface IAuditLogReadRepository extends IReadRepository<AuditLogEntryId, AuditLogEntry> {
  findByTenantId(tenantId: string): Promise<AuditLogEntry[]>;
  findByBoundedContext(boundedContext: string): Promise<AuditLogEntry[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLogEntry[]>;
}

export interface IAuditLogWriteRepository extends IWriteRepository<AuditLogEntryId, AuditLogEntry> {
  deleteByRetentionPolicy(olderThan: Date): Promise<void>;
}
