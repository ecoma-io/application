/**
 * @fileoverview Service xử lý chính sách lưu trữ
 * @since 1.0.0
 */

import { RetentionPolicy } from '../aggregates';
import { RetentionPolicyId, RetentionRule } from '../value-objects';
import { IEventBus, IQuerySpecification } from '@ecoma/common-domain';
import { IRetentionPolicyReadRepository, IRetentionPolicyWriteRepository } from '../repositories';
import { PolicyNotFoundError } from '../errors';

class EmptyQuerySpecification implements IQuerySpecification<RetentionPolicy> {
  isSatisfiedBy(_entity: RetentionPolicy): boolean {
    return true;
  }

  getFilters(): Array<{field: keyof RetentionPolicy, operator: string, value: unknown}> {
    return [];
  }

  getSorts(): Array<{field: keyof RetentionPolicy, direction: 'asc' | 'desc'}> {
    return [];
  }

  getLimit(): number {
    return 100;
  }

  getOffset(): number {
    return 0;
  }
}

class ActivePolicyQuerySpecification implements IQuerySpecification<RetentionPolicy> {
  isSatisfiedBy(_entity: RetentionPolicy): boolean {
    return _entity.actived;
  }

  getFilters(): Array<{field: keyof RetentionPolicy, operator: string, value: unknown}> {
    return [{field: 'actived', operator: '=', value: true}];
  }

  getSorts(): Array<{field: keyof RetentionPolicy, direction: 'asc' | 'desc'}> {
    return [];
  }

  getLimit(): number {
    return 100;
  }

  getOffset(): number {
    return 0;
  }
}

class BoundedContextQuerySpecification implements IQuerySpecification<RetentionPolicy> {
  constructor(private readonly boundedContext: string) {}

  isSatisfiedBy(entity: RetentionPolicy): boolean {
    return entity.rules.some(rule => rule.boundedContext === this.boundedContext);
  }

  getFilters(): Array<{field: keyof RetentionPolicy, operator: string, value: unknown}> {
    return [{field: 'rules', operator: 'contains', value: {boundedContext: this.boundedContext}}];
  }

  getSorts(): Array<{field: keyof RetentionPolicy, direction: 'asc' | 'desc'}> {
    return [];
  }

  getLimit(): number {
    return 100;
  }

  getOffset(): number {
    return 0;
  }
}

class TenantIdQuerySpecification implements IQuerySpecification<RetentionPolicy> {
  constructor(private readonly tenantId: string) {}

  isSatisfiedBy(entity: RetentionPolicy): boolean {
    return entity.rules.some(rule => rule.tenantId === this.tenantId);
  }

  getFilters(): Array<{field: keyof RetentionPolicy, operator: string, value: unknown}> {
    return [{field: 'rules', operator: 'contains', value: {tenantId: this.tenantId}}];
  }

  getSorts(): Array<{field: keyof RetentionPolicy, direction: 'asc' | 'desc'}> {
    return [];
  }

  getLimit(): number {
    return 100;
  }

  getOffset(): number {
    return 0;
  }
}

export class RetentionPolicyService {
  constructor(
    private readonly readRepository: IRetentionPolicyReadRepository,
    private readonly writeRepository: IRetentionPolicyWriteRepository,
    private readonly eventBus: IEventBus
  ) {}

  async createPolicy(
    id: RetentionPolicyId,
    name: string,
    description: string,
    rules: RetentionRule[]
  ): Promise<RetentionPolicy> {
    const policy = RetentionPolicy.create(id, name, description, rules);
    await this.writeRepository.save(policy);
    await this.eventBus.publish(policy.getDomainEvents());
    return policy;
  }

  async updatePolicy(
    id: RetentionPolicyId,
    name: string,
    description: string,
    rules: RetentionRule[]
  ): Promise<RetentionPolicy> {
    const policy = await this.readRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundError('Policy not found with the given ID');
    }

    policy.update(name, description, rules);
    await this.writeRepository.save(policy);
    await this.eventBus.publish(policy.getDomainEvents());
    return policy;
  }

  async activatePolicy(id: RetentionPolicyId): Promise<RetentionPolicy> {
    const policy = await this.readRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundError('Policy not found with the given ID');
    }

    policy.activate();
    await this.writeRepository.save(policy);
    await this.eventBus.publish(policy.getDomainEvents());
    return policy;
  }

  async deactivatePolicy(id: RetentionPolicyId): Promise<RetentionPolicy> {
    const policy = await this.readRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundError('Policy not found with the given ID');
    }

    policy.deactivate();
    await this.writeRepository.save(policy);
    await this.eventBus.publish(policy.getDomainEvents());
    return policy;
  }

  async updatePolicyRules(id: RetentionPolicyId, rules: RetentionRule[]): Promise<RetentionPolicy> {
    const policy = await this.readRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundError('Policy not found with the given ID');
    }

    policy.update(policy.name, policy.description, rules);
    await this.writeRepository.save(policy);
    await this.eventBus.publish(policy.getDomainEvents());
    return policy;
  }

  async getPolicy(id: RetentionPolicyId): Promise<RetentionPolicy | null> {
    return this.readRepository.findById(id);
  }

  async getAllPolicies(): Promise<RetentionPolicy[]> {
    return this.readRepository.find(new EmptyQuerySpecification());
  }

  async getActivePolicies(): Promise<RetentionPolicy[]> {
    return this.readRepository.find(new ActivePolicyQuerySpecification());
  }

  async getPoliciesByBoundedContext(boundedContext: string): Promise<RetentionPolicy[]> {
    return this.readRepository.find(new BoundedContextQuerySpecification(boundedContext));
  }

  async getPoliciesByTenantId(tenantId: string): Promise<RetentionPolicy[]> {
    return this.readRepository.find(new TenantIdQuerySpecification(tenantId));
  }
}
