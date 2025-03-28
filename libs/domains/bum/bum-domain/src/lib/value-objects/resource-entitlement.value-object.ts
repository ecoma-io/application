import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

/**
 * Đại diện cho quyền lợi tài nguyên, bao gồm loại tài nguyên và giới hạn số lượng
 */
interface IResourceEntitlementProps {
  resourceType: string;
  limit: number;
}

export class ResourceEntitlement extends AbstractValueObject<IResourceEntitlementProps> {
  constructor(resourceType: string, limit: number) {
    super({ resourceType, limit });
    this.validate();
  }

  get resourceType(): string {
    return this.props.resourceType;
  }

  get limit(): number {
    return this.props.limit;
  }

  private validate(): void {
    Guard.againstNullOrUndefined(this.props.resourceType, 'resourceType');
    Guard.againstEmptyString(this.props.resourceType, 'resourceType');

    if (this.props.limit < 0) {
      throw new Error('Resource limit cannot be negative');
    }
  }

  /**
   * Kiểm tra xem mức sử dụng hiện tại có vượt quá giới hạn không
   * @param usage Mức sử dụng hiện tại
   * @returns true nếu vượt quá giới hạn, ngược lại là false
   */
  public isLimitExceeded(usage: number): boolean {
    return usage > this.props.limit;
  }

  /**
   * Tính toán số lượng tài nguyên còn lại có thể sử dụng
   * @param currentUsage Mức sử dụng hiện tại
   * @returns Số lượng tài nguyên còn lại
   */
  public remainingResources(currentUsage: number): number {
    const usageToCheck = currentUsage < 0 ? 0 : currentUsage;
    return Math.max(0, this.props.limit - usageToCheck);
  }

  /**
   * Kiểm tra xem có thể thêm lượng sử dụng bổ sung không
   * @param currentUsage Mức sử dụng hiện tại
   * @param additionalUsage Lượng sử dụng bổ sung cần kiểm tra
   * @returns true nếu có thể thêm, ngược lại là false
   */
  public canAddUsage(currentUsage: number, additionalUsage: number): boolean {
    const usageToCheck = currentUsage < 0 ? 0 : currentUsage;
    return usageToCheck + additionalUsage <= this.props.limit;
  }
}
