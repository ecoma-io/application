import { IReadRepository } from '@ecoma/common-domain';
import { RetentionPolicyId } from '../value-objects';
import { RetentionPolicy } from '../aggregates';

export interface IRetentionPolicyReadRepository extends IReadRepository<RetentionPolicyId, RetentionPolicy> {
  findByBoundedContext(boundedContext: string): Promise<RetentionPolicy[]>;
  findByTenantId(tenantId: string): Promise<RetentionPolicy[]>;
  findActive(): Promise<RetentionPolicy[]>;
  findByActionType(actionType: string): Promise<RetentionPolicy[]>;
  findByEntityType(entityType: string): Promise<RetentionPolicy[]>;
  findByRetentionDuration(durationValue: number, durationUnit: 'Day' | 'Month' | 'Year'): Promise<RetentionPolicy[]>;
}
