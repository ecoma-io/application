import { IWriteRepository } from '@ecoma/common-domain';
import { RetentionPolicy } from '../aggregates';
import { RetentionPolicyId, RetentionRule } from '../value-objects';

export interface IRetentionPolicyWriteRepository extends IWriteRepository<RetentionPolicyId, RetentionPolicy> {
  update(policy: RetentionPolicy): Promise<void>;
  activate(id: RetentionPolicyId): Promise<void>;
  deactivate(id: RetentionPolicyId): Promise<void>;
  updateRules(id: RetentionPolicyId, rules: RetentionRule[]): Promise<void>;
}
