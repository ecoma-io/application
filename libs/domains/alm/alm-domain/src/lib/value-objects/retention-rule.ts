import { AbstractValueObject } from '@ecoma/common-domain';
import { RetentionDurationValueError, RetentionDurationUnitError } from '../errors';

export interface IRetentionRuleProps {
  retentionDurationValue: number;
  retentionDurationUnit: 'Day' | 'Month' | 'Year';
  boundedContext?: string;
  actionType?: string;
  entityType?: string;
  tenantId?: string;
}

export class RetentionRule extends AbstractValueObject<IRetentionRuleProps> {
  private constructor(props: IRetentionRuleProps) {
    super(props);
  }

  public static create(props: IRetentionRuleProps): RetentionRule {
    // Validate retention duration
    if (props.retentionDurationValue <= 0) {
      throw new RetentionDurationValueError('Retention duration value must be greater than 0');
    }

    // Validate duration unit
    if (!['Day', 'Month', 'Year'].includes(props.retentionDurationUnit)) {
      throw new RetentionDurationUnitError('Invalid retention duration unit. Must be one of: Day, Month, Year');
    }

    return new RetentionRule(props);
  }

  get retentionDurationValue(): number {
    return this.props.retentionDurationValue;
  }

  get retentionDurationUnit(): 'Day' | 'Month' | 'Year' {
    return this.props.retentionDurationUnit;
  }

  get boundedContext(): string | undefined {
    return this.props.boundedContext;
  }

  get actionType(): string | undefined {
    return this.props.actionType;
  }

  get entityType(): string | undefined {
    return this.props.entityType;
  }

  get tenantId(): string | undefined {
    return this.props.tenantId;
  }

  // Helper method để chuyển đổi thành số ngày
  public toDays(): number {
    switch (this.retentionDurationUnit) {
      case 'Day':
        return this.retentionDurationValue;
      case 'Month':
        return this.retentionDurationValue * 30; // Ước lượng
      case 'Year':
        return this.retentionDurationValue * 365; // Ước lượng
      default:
        throw new RetentionDurationUnitError('Invalid retention duration unit');
    }
  }

  // Kiểm tra xem rule có áp dụng cho một audit log entry cụ thể không
  public isApplicableTo(boundedContext: string, actionType?: string, entityType?: string, tenantId?: string): boolean {
    if (this.boundedContext && this.boundedContext !== boundedContext) {
      return false;
    }

    if (this.actionType && actionType && this.actionType !== actionType) {
      return false;
    }

    if (this.entityType && entityType && this.entityType !== entityType) {
      return false;
    }

    if (this.tenantId && tenantId && this.tenantId !== tenantId) {
      return false;
    }

    return true;
  }
}
