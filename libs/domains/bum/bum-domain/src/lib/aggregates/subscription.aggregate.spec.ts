import { Subscription } from './subscription.aggregate';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';
import { SubscriptionStatus } from '../value-objects/subscription-status.value-object';
import { SubscriptionActivatedEvent } from '../domain-events/subscription-activated.event';
import { SubscriptionSuspendedEvent } from '../domain-events/subscription-suspended.event';
import { SubscriptionPlanChangedEvent } from '../domain-events/subscription-plan-changed.event';

describe('Subscription', () => {
  let subscriptionId: SubscriptionId;
  let organizationId: OrganizationId;
  let pricingPlanId: PricingPlanId;
  let status: SubscriptionStatus;
  let startDate: Date;
  let endDate: Date;
  let autoRenew: boolean;

  beforeEach(() => {
    subscriptionId = new SubscriptionId('sub_123');
    organizationId = new OrganizationId('org_123');
    pricingPlanId = new PricingPlanId('plan_123');
    status = SubscriptionStatus.active();
    startDate = new Date('2023-01-01');
    endDate = new Date('2023-12-31');
    autoRenew = true;
  });

  it('nên tạo được một đối tượng hợp lệ', () => {
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      status,
      startDate,
      endDate,
      autoRenew
    );

    expect(subscription).toBeDefined();
    expect(subscription.subscriptionId).toEqual(subscriptionId);
    expect(subscription.organizationIdValue).toEqual(organizationId);
    expect(subscription.pricingPlanIdValue).toEqual(pricingPlanId);
    expect(subscription.statusValue).toEqual(status);
    expect(subscription.startDateValue).toEqual(startDate);
    expect(subscription.endDateValue).toEqual(endDate);
    expect(subscription.autoRenewValue).toBe(autoRenew);
  });

  it('nên ném lỗi khi endDate trước startDate', () => {
    const invalidEndDate = new Date('2022-12-31'); // Trước startDate

    expect(() => {
      new Subscription(
        subscriptionId,
        organizationId,
        pricingPlanId,
        status,
        startDate,
        invalidEndDate,
        autoRenew
      );
    }).toThrow('Ngày bắt đầu không thể sau ngày kết thúc');
  });

  it('nên kích hoạt một subscription đã bị tạm ngưng', () => {
    // Tạo một subscription bị tạm ngưng
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.suspended(),
      startDate,
      endDate,
      autoRenew
    );

    // Xác nhận rằng subscription đang bị tạm ngưng
    expect(subscription.statusValue.isSuspended()).toBe(true);

    // Kích hoạt subscription
    subscription.activate();

    // Xác nhận rằng subscription đã được kích hoạt
    expect(subscription.statusValue.isActive()).toBe(true);

    // Kiểm tra domain event được tạo ra
    const domainEvents = subscription.getUncommittedEvents();
    expect(domainEvents.length).toBe(1);
    expect(domainEvents[0]).toBeInstanceOf(SubscriptionActivatedEvent);

    const event = domainEvents[0] as SubscriptionActivatedEvent;
    expect(event.subscriptionId).toEqual(subscriptionId);
    expect(event.organizationId).toEqual(organizationId);
    expect(event.pricingPlanId).toEqual(pricingPlanId);
  });

  it('nên tạm ngưng một subscription đang hoạt động', () => {
    // Tạo một subscription đang hoạt động
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      autoRenew
    );

    // Xác nhận rằng subscription đang hoạt động
    expect(subscription.statusValue.isActive()).toBe(true);

    // Tạm ngưng subscription
    const reason = 'Payment overdue';
    subscription.suspend(reason);

    // Xác nhận rằng subscription đã bị tạm ngưng
    expect(subscription.statusValue.isSuspended()).toBe(true);

    // Kiểm tra domain event được tạo ra
    const domainEvents = subscription.getUncommittedEvents();
    expect(domainEvents.length).toBe(1);
    expect(domainEvents[0]).toBeInstanceOf(SubscriptionSuspendedEvent);

    const event = domainEvents[0] as SubscriptionSuspendedEvent;
    expect(event.subscriptionId).toEqual(subscriptionId);
    expect(event.organizationId).toEqual(organizationId);
    expect(event.reason).toBe(reason);
  });

  it('nên thay đổi gói đăng ký của subscription', () => {
    // Tạo một subscription
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      autoRenew
    );

    // Thay đổi gói đăng ký
    const newPlanId = new PricingPlanId('plan_456');
    subscription.changePlan(newPlanId);

    // Xác nhận rằng gói đăng ký đã được thay đổi
    expect(subscription.pricingPlanIdValue).toEqual(newPlanId);

    // Kiểm tra domain event được tạo ra
    const domainEvents = subscription.getUncommittedEvents();
    expect(domainEvents.length).toBe(1);
    expect(domainEvents[0]).toBeInstanceOf(SubscriptionPlanChangedEvent);

    const event = domainEvents[0] as SubscriptionPlanChangedEvent;
    expect(event.subscriptionId).toEqual(subscriptionId);
    expect(event.organizationId).toEqual(organizationId);
    expect(event.oldPlanId).toEqual(pricingPlanId);
    expect(event.newPlanId).toEqual(newPlanId);
  });

  it('nên cập nhật ngày kết thúc của subscription', () => {
    // Tạo một subscription
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      autoRenew
    );

    // Cập nhật ngày kết thúc
    const newEndDate = new Date('2024-12-31');
    subscription.updateEndDate(newEndDate);

    // Xác nhận rằng ngày kết thúc đã được cập nhật
    expect(subscription.endDateValue).toEqual(newEndDate);
  });

  it('nên ném lỗi khi cập nhật ngày kết thúc trước ngày bắt đầu', () => {
    // Tạo một subscription
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      autoRenew
    );

    // Cố gắng cập nhật ngày kết thúc trước ngày bắt đầu
    const invalidEndDate = new Date('2022-12-31'); // Trước startDate

    expect(() => {
      subscription.updateEndDate(invalidEndDate);
    }).toThrow('Ngày kết thúc mới phải sau ngày bắt đầu');
  });

  it('nên đặt trạng thái tự động gia hạn', () => {
    // Tạo một subscription với autoRenew = false
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      false
    );

    // Xác nhận rằng autoRenew ban đầu là false
    expect(subscription.autoRenewValue).toBe(false);

    // Đặt autoRenew = true
    subscription.setAutoRenew(true);

    // Xác nhận rằng autoRenew đã được cập nhật
    expect(subscription.autoRenewValue).toBe(true);
  });
});
