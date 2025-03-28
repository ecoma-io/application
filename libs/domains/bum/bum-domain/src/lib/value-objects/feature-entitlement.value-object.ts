import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

/**
 * Đại diện cho quyền lợi tính năng, bao gồm loại tính năng và trạng thái kích hoạt
 */
interface IFeatureEntitlementProps {
  featureType: string;
  isEnabled: boolean;
}

export class FeatureEntitlement extends AbstractValueObject<IFeatureEntitlementProps> {
  constructor(featureType: string, isEnabled: boolean) {
    super({ featureType, isEnabled });
    this.validate();
  }

  get featureType(): string {
    return this.props.featureType;
  }

  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  private validate(): void {
    Guard.againstNullOrUndefined(this.props.featureType, 'featureType');
    Guard.againstEmptyString(this.props.featureType, 'featureType');
    Guard.againstNullOrUndefined(this.props.isEnabled, 'isEnabled');
  }

  /**
   * Tạo một bản sao của FeatureEntitlement với trạng thái kích hoạt mới
   * @param isEnabled Trạng thái kích hoạt mới
   * @returns Một đối tượng FeatureEntitlement mới
   */
  public withIsEnabled(isEnabled: boolean): FeatureEntitlement {
    return new FeatureEntitlement(this.props.featureType, isEnabled);
  }
}
