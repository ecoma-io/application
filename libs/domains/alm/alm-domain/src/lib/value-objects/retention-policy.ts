import { AbstractValueObject } from '@ecoma/common-domain';
import { RetentionRule } from './retention-rule';
import { PolicyNameRequiredError, RetentionRuleRequiredError } from '../errors';

export interface IRetentionPolicyProps {
  name: string;
  description?: string;
  rules: RetentionRule[];
  isActive: boolean;
  boundedContext: string;
  tenantId: string;
}

export class RetentionPolicy extends AbstractValueObject<IRetentionPolicyProps> {
  private constructor(props: IRetentionPolicyProps) {
    super(props);
  }

  public static create(props: IRetentionPolicyProps): RetentionPolicy {
    // Validate policy name
    if (!props.name || props.name.trim().length === 0) {
      throw new PolicyNameRequiredError('Policy name is required');
    }

    // Validate rules
    if (!props.rules || props.rules.length === 0) {
      throw new RetentionRuleRequiredError('At least one retention rule is required');
    }

    return new RetentionPolicy(props);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get rules(): RetentionRule[] {
    return [...this.props.rules];
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get boundedContext(): string {
    return this.props.boundedContext;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  public activate(): RetentionPolicy {
    return new RetentionPolicy({
      ...this.props,
      isActive: true
    });
  }

  public deactivate(): RetentionPolicy {
    return new RetentionPolicy({
      ...this.props,
      isActive: false
    });
  }

  public addRule(rule: RetentionRule): RetentionPolicy {
    return new RetentionPolicy({
      ...this.props,
      rules: [...this.props.rules, rule]
    });
  }

  public removeRule(rule: RetentionRule): RetentionPolicy {
    return new RetentionPolicy({
      ...this.props,
      rules: this.props.rules.filter(r => !r.equals(rule))
    });
  }

  public update(props: Partial<IRetentionPolicyProps>): RetentionPolicy {
    return new RetentionPolicy({
      ...this.props,
      ...props
    });
  }

  // Tìm rule phù hợp nhất cho một audit log entry cụ thể
  public findApplicableRule(boundedContext: string, actionType?: string, entityType?: string, tenantId?: string): RetentionRule | null {
    // Tìm rule cụ thể nhất (có nhiều điều kiện match nhất)
    const applicableRules = this.rules.filter(rule =>
      rule.isApplicableTo(boundedContext, actionType, entityType, tenantId)
    );

    if (applicableRules.length === 0) {
      return null;
    }

    // Tính điểm specificity cho mỗi rule (rule có nhiều điều kiện match sẽ có điểm cao hơn)
    const ruleScores = applicableRules.map(rule => {
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
    const applicableRule = this.findApplicableRule(boundedContext, actionType, entityType, tenantId);
    if (!applicableRule || !this.isActive) {
      return false;
    }

    const retentionDays = applicableRule.toDays();
    const now = new Date();
    const ageInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    return ageInDays > retentionDays;
  }
}
