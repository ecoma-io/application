import { AbstractAggregate } from "@ecoma/common-domain";
import {
  RetentionPolicyActivatedEvent,
  RetentionPolicyCreatedEvent,
  RetentionPolicyDeactivatedEvent,
  RetentionPolicyUpdatedEvent,
} from "../events";
import { PolicyNameRequiredError, RetentionRuleRequiredError } from "../errors";
import { RetentionPolicyId, RetentionRule } from "../value-objects";

/**
 * Aggregate root đại diện cho một chính sách lưu trữ
 */
export class RetentionPolicy extends AbstractAggregate<RetentionPolicyId> {
  constructor(
    id: RetentionPolicyId,
    private readonly nameValue: string,
    private readonly descriptionValue: string,
    private readonly rulesValue: RetentionRule[],
    private isActive: boolean,
    private readonly createdAtValue: Date,
    private readonly updatedAtValue: Date
  ) {
    super(id);
  }

  /**
   * Factory method để tạo mới RetentionPolicy
   * @param {RetentionPolicyId} id - ID của policy
   * @param {string} name - Tên của policy
   * @param {string} description - Mô tả của policy
   * @param {RetentionRule[]} rules - Danh sách các rule
   * @returns {RetentionPolicy} Instance mới của RetentionPolicy
   * @throws {PolicyNameRequiredError} Nếu tên policy trống
   * @throws {RetentionRuleRequiredError} Nếu không có rule nào
   * @example
   * RetentionPolicy.create(...)
   * @since 1.0.0
   */
  public static create(
    id: RetentionPolicyId,
    name: string,
    description: string,
    rules: RetentionRule[]
  ): RetentionPolicy {
    // Validate
    if (!name || name.trim().length === 0) {
      throw new PolicyNameRequiredError("Policy name is required");
    }

    if (!rules || rules.length === 0) {
      throw new RetentionRuleRequiredError(
        "At least one retention rule is required"
      );
    }

    const now = new Date();
    const policy = new RetentionPolicy(
      id,
      name,
      description,
      rules,
      true, // Active by default
      now,
      now
    );

    // Add domain event
    policy.addDomainEvent(
      new RetentionPolicyCreatedEvent(
        id,
        name,
        description,
        rules,
        true // isActive
      )
    );

    return policy;
  }

  /**
   * Lấy ID của retention policy
   * @returns {string} ID của retention policy
   * @example
   * policy.getIdentifier();
   * @since 1.0.0
   */
  public getIdentifier(): string {
    return this.id.toString();
  }

  get name(): string {
    return this.nameValue;
  }

  get description(): string {
    return this.descriptionValue;
  }

  get rules(): RetentionRule[] {
    return [...this.rulesValue]; // Return a copy to prevent direct modification
  }

  get actived(): boolean {
    return this.isActive;
  }

  get createdAt(): Date {
    return this.createdAtValue;
  }

  get updatedAt(): Date {
    return this.updatedAtValue;
  }

  /**
   * Update policy
   * @param {string} name - Tên mới của policy
   * @param {string} description - Mô tả mới của policy
   * @param {RetentionRule[]} rules - Danh sách rule mới
   * @throws {PolicyNameRequiredError} Nếu tên policy trống
   * @throws {RetentionRuleRequiredError} Nếu không có rule nào
   * @example
   * policy.update('Tên mới', 'Mô tả', [rule1, rule2]);
   * @since 1.0.0
   */
  public update(
    name: string,
    description: string,
    rules: RetentionRule[]
  ): void {
    // Validate
    if (!name || name.trim().length === 0) {
      throw new PolicyNameRequiredError("Policy name is required");
    }

    if (!rules || rules.length === 0) {
      throw new RetentionRuleRequiredError(
        "At least one retention rule is required"
      );
    }

    // Store old rules for event
    const oldRules = this.rules;

    // Create new instance with updated properties
    const updated = new RetentionPolicy(
      this.id,
      name,
      description,
      rules,
      this.isActive,
      this.createdAtValue,
      new Date()
    );

    // Copy properties from updated instance
    Object.assign(this, updated);

    // Add domain event
    this.addDomainEvent(
      new RetentionPolicyUpdatedEvent(
        this.id,
        name,
        description,
        oldRules,
        rules
      )
    );
  }

  /**
   * Kích hoạt policy
   * @example
   * policy.activate();
   * @since 1.0.0
   */
  public activate(): void {
    if (this.isActive) {
      return; // Already active
    }

    this.isActive = true;
    this.addDomainEvent(new RetentionPolicyActivatedEvent(this.id));
  }

  /**
   * Vô hiệu hóa policy
   * @example
   * policy.deactivate();
   * @since 1.0.0
   */
  public deactivate(): void {
    if (!this.isActive) {
      return; // Already inactive
    }

    this.isActive = false;
    this.addDomainEvent(new RetentionPolicyDeactivatedEvent(this.id));
  }

  /**
   * Tìm rule phù hợp nhất cho một audit log entry cụ thể
   * @param {string} boundedContext - BC
   * @param {string} [actionType] - Loại hành động
   * @param {string} [entityType] - Loại entity
   * @param {string} [tenantId] - Tenant
   * @returns {RetentionRule | null} Rule phù hợp hoặc null
   * @example
   * policy.findApplicableRule('ALM', 'CREATE', 'User', 'tenant1');
   * @since 1.0.0
   */
  public findApplicableRule(
    boundedContext: string,
    actionType?: string,
    entityType?: string,
    tenantId?: string
  ): RetentionRule | null {
    if (!this.isActive) {
      return null;
    }

    // Tìm rule cụ thể nhất (có nhiều điều kiện match nhất)
    const applicableRules = this.rules.filter((rule) =>
      rule.isApplicableTo(boundedContext, actionType, entityType, tenantId)
    );

    if (applicableRules.length === 0) {
      return null;
    }

    // Tính điểm specificity cho mỗi rule (rule có nhiều điều kiện match sẽ có điểm cao hơn)
    const ruleScores = applicableRules.map((rule) => {
      let score = 0;
      if (rule.boundedContext) score += 1;
      if (rule.actionType) score += 1;
      if (rule.entityType) score += 1;
      if (rule.tenantId) score += 1;
      return { rule, score };
    });

    // Sắp xếp theo điểm giảm dần và lấy rule có điểm cao nhất
    ruleScores.sort((a, b) => b.score - a.score);
    return ruleScores[0].rule;
  }

  // Kiểm tra xem một audit log entry có cần được xóa dựa trên thời gian hay không
  public shouldDelete(
    boundedContext: string,
    createdAt: Date,
    actionType?: string,
    entityType?: string,
    tenantId?: string
  ): boolean {
    const applicableRule = this.findApplicableRule(
      boundedContext,
      actionType,
      entityType,
      tenantId
    );
    if (!applicableRule || !this.isActive) {
      return false;
    }

    const retentionDays = applicableRule.toDays();
    const now = new Date();
    const ageInDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    return ageInDays > retentionDays;
  }
}
