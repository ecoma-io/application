import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export type SubscriptionStatusValue = 'Active' | 'Suspended' | 'Cancelled' | 'PendingPayment' | 'TrialPeriod';

interface ISubscriptionStatusProps {
  value: SubscriptionStatusValue;
}

/**
 * Value Object đại diện cho trạng thái đăng ký.
 */
export class SubscriptionStatus extends AbstractValueObject<ISubscriptionStatusProps> {
  /**
   * Danh sách các trạng thái hợp lệ
   */
  public static readonly validStatuses: SubscriptionStatusValue[] = [
    'Active',
    'Suspended',
    'Cancelled',
    'PendingPayment',
    'TrialPeriod'
  ];

  get value(): SubscriptionStatusValue {
    return this.props.value;
  }

  private validate(): void {
    Guard.againstNullOrUndefined(this.props.value, 'subscriptionStatus');

    if (!SubscriptionStatus.validStatuses.includes(this.props.value)) {
      throw new Error(`Invalid subscription status: ${this.props.value}`);
    }
  }

  constructor(status: SubscriptionStatusValue) {
    super({ value: status });
    this.validate();
  }

  /**
   * Tạo một SubscriptionStatus từ chuỗi
   * @param status Chuỗi trạng thái
   * @returns SubscriptionStatus tương ứng
   * @throws Error nếu chuỗi không phải là trạng thái hợp lệ
   */
  public static fromString(status: string): SubscriptionStatus {
    if (!SubscriptionStatus.validStatuses.includes(status as SubscriptionStatusValue)) {
      throw new Error(`Invalid subscription status: ${status}`);
    }
    return new SubscriptionStatus(status as SubscriptionStatusValue);
  }

  /**
   * Tạo trạng thái Active
   * @returns SubscriptionStatus với giá trị Active
   */
  public static active(): SubscriptionStatus {
    return new SubscriptionStatus('Active');
  }

  /**
   * Tạo trạng thái Suspended
   * @returns SubscriptionStatus với giá trị Suspended
   */
  public static suspended(): SubscriptionStatus {
    return new SubscriptionStatus('Suspended');
  }

  /**
   * Tạo trạng thái Cancelled
   * @returns SubscriptionStatus với giá trị Cancelled
   */
  public static cancelled(): SubscriptionStatus {
    return new SubscriptionStatus('Cancelled');
  }

  /**
   * Tạo trạng thái PendingPayment
   * @returns SubscriptionStatus với giá trị PendingPayment
   */
  public static pendingPayment(): SubscriptionStatus {
    return new SubscriptionStatus('PendingPayment');
  }

  /**
   * Tạo trạng thái TrialPeriod
   * @returns SubscriptionStatus với giá trị TrialPeriod
   */
  public static trialPeriod(): SubscriptionStatus {
    return new SubscriptionStatus('TrialPeriod');
  }

  /**
   * Kiểm tra xem trạng thái có phải là Active không
   * @returns true nếu trạng thái là Active, ngược lại là false
   */
  public isActive(): boolean {
    return this.props.value === 'Active';
  }

  /**
   * Kiểm tra xem trạng thái có phải là Suspended không
   * @returns true nếu trạng thái là Suspended, ngược lại là false
   */
  public isSuspended(): boolean {
    return this.props.value === 'Suspended';
  }

  /**
   * Kiểm tra xem trạng thái có phải là Cancelled không
   * @returns true nếu trạng thái là Cancelled, ngược lại là false
   */
  public isCancelled(): boolean {
    return this.props.value === 'Cancelled';
  }
}
