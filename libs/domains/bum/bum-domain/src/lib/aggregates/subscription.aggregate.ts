import { AbstractAggregate, AbstractDomainEvent } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';
import { SubscriptionStatus } from '../value-objects/subscription-status.value-object';
import { SubscriptionActivatedEvent } from '../domain-events/subscription-activated.event';
import { SubscriptionSuspendedEvent } from '../domain-events/subscription-suspended.event';
import { SubscriptionPlanChangedEvent } from '../domain-events/subscription-plan-changed.event';

/**
 * Aggregate đại diện cho một đăng ký dịch vụ
 */
export class Subscription extends AbstractAggregate<SubscriptionId> {
  private organizationId: OrganizationId;
  private pricingPlanId: PricingPlanId;
  private status: SubscriptionStatus;
  private startDate: Date;
  private endDate: Date;
  private autoRenewFlag: boolean;

  get subscriptionId(): SubscriptionId {
    return this.id;
  }

  get organizationIdValue(): OrganizationId {
    return this.organizationId;
  }

  get pricingPlanIdValue(): PricingPlanId {
    return this.pricingPlanId;
  }

  get statusValue(): SubscriptionStatus {
    return this.status;
  }

  get startDateValue(): Date {
    return new Date(this.startDate);
  }

  get endDateValue(): Date {
    return new Date(this.endDate);
  }

  get autoRenewValue(): boolean {
    return this.autoRenewFlag;
  }

  /**
   * Lấy danh sách các domain event chưa được commit
   * @returns Danh sách các domain event
   */
  public getUncommittedEvents(): AbstractDomainEvent[] {
    return this.getDomainEvents();
  }

  /**
   * Tạo một đăng ký mới
   * @param id ID của đăng ký
   * @param organizationId ID của tổ chức sở hữu đăng ký
   * @param pricingPlanId ID của gói dịch vụ
   * @param status Trạng thái đăng ký
   * @param startDate Ngày bắt đầu đăng ký
   * @param endDate Ngày kết thúc đăng ký
   * @param autoRenew Có tự động gia hạn không
   */
  constructor(
    id: SubscriptionId,
    organizationId: OrganizationId,
    pricingPlanId: PricingPlanId,
    status: SubscriptionStatus,
    startDate: Date,
    endDate: Date,
    autoRenew = false
  ) {
    super(id);

    this.organizationId = organizationId;
    this.pricingPlanId = pricingPlanId;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.autoRenewFlag = autoRenew;

    this.validate();
  }

  private validate(): void {
    Guard.againstNullOrUndefined(this.organizationId, 'organizationId');
    Guard.againstNullOrUndefined(this.pricingPlanId, 'pricingPlanId');
    Guard.againstNullOrUndefined(this.status, 'status');
    Guard.againstNullOrUndefined(this.startDate, 'startDate');
    Guard.againstNullOrUndefined(this.endDate, 'endDate');

    if (this.startDate > this.endDate) {
      throw new Error('Ngày bắt đầu không thể sau ngày kết thúc');
    }
  }

  /**
   * Kích hoạt đăng ký
   */
  public activate(): void {
    if (this.status.isActive()) {
      return; // Đã kích hoạt rồi
    }

    this.status = SubscriptionStatus.active();

    this.addDomainEvent(
      new SubscriptionActivatedEvent(
        this.id,
        this.organizationId,
        this.pricingPlanId,
        new Date()
      )
    );
  }

  /**
   * Tạm ngưng đăng ký
   * @param reason Lý do tạm ngưng
   */
  public suspend(reason: string): void {
    if (this.status.isSuspended()) {
      return; // Đã tạm ngưng rồi
    }

    this.status = SubscriptionStatus.suspended();

    this.addDomainEvent(
      new SubscriptionSuspendedEvent(
        this.id,
        this.organizationId,
        reason,
        new Date()
      )
    );
  }

  /**
   * Thay đổi gói dịch vụ
   * @param newPlanId ID của gói dịch vụ mới
   */
  public changePlan(newPlanId: PricingPlanId): void {
    Guard.againstNullOrUndefined(newPlanId, 'newPlanId');

    const oldPlanId = this.pricingPlanId;
    this.pricingPlanId = newPlanId;

    this.addDomainEvent(
      new SubscriptionPlanChangedEvent(
        this.id,
        this.organizationId,
        oldPlanId,
        newPlanId,
        new Date()
      )
    );
  }

  /**
   * Cập nhật ngày kết thúc đăng ký
   * @param newEndDate Ngày kết thúc mới
   */
  public updateEndDate(newEndDate: Date): void {
    Guard.againstNullOrUndefined(newEndDate, 'newEndDate');

    if (newEndDate <= this.startDate) {
      throw new Error('Ngày kết thúc mới phải sau ngày bắt đầu');
    }

    this.endDate = newEndDate;
  }

  /**
   * Đặt trạng thái tự động gia hạn
   * @param autoRenew Giá trị tự động gia hạn mới
   */
  public setAutoRenew(autoRenew: boolean): void {
    this.autoRenewFlag = autoRenew;
  }
}
