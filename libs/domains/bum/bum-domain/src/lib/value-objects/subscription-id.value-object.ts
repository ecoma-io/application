import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface ISubscriptionIdProps {
  value: string;
}

/**
 * Value Object đại diện cho định danh duy nhất của một đăng ký (subscription)
 */
export class SubscriptionId extends AbstractValueObject<ISubscriptionIdProps> {
  constructor(id: string) {
    super({ value: id });
    Guard.againstNullOrUndefined(id, 'subscriptionId');
    Guard.againstEmptyString(id, 'subscriptionId');
  }

  get value(): string {
    return this.props.value;
  }

  public override equals(id?: SubscriptionId): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.props.value === id.props.value;
  }
}
