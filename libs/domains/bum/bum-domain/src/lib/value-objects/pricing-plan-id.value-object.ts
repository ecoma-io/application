import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface IPricingPlanIdProps {
  value: string;
}

/**
 * Value Object đại diện cho định danh duy nhất của một gói dịch vụ (pricing plan)
 */
export class PricingPlanId extends AbstractValueObject<IPricingPlanIdProps> {
  constructor(id: string) {
    super({ value: id });
    Guard.againstNullOrUndefined(id, 'pricingPlanId');
    Guard.againstEmptyString(id, 'pricingPlanId');
  }

  get value(): string {
    return this.props.value;
  }

  public override equals(id?: PricingPlanId): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.props.value === id.props.value;
  }
}
