import { SubscriptionStatus } from './subscription-status.value-object';

describe('SubscriptionStatus', () => {
  it('nên tạo được trạng thái Active', () => {
    const status = SubscriptionStatus.active();
    expect(status.value).toBe('Active');
    expect(status.isActive()).toBe(true);
  });

  it('nên tạo được trạng thái Suspended', () => {
    const status = SubscriptionStatus.suspended();
    expect(status.value).toBe('Suspended');
    expect(status.isSuspended()).toBe(true);
  });

  it('nên tạo được trạng thái Cancelled', () => {
    const status = SubscriptionStatus.cancelled();
    expect(status.value).toBe('Cancelled');
    expect(status.isCancelled()).toBe(true);
  });

  it('nên tạo được trạng thái PendingPayment', () => {
    const status = SubscriptionStatus.pendingPayment();
    expect(status.value).toBe('PendingPayment');
  });

  it('nên tạo được trạng thái TrialPeriod', () => {
    const status = SubscriptionStatus.trialPeriod();
    expect(status.value).toBe('TrialPeriod');
  });

  it('nên tạo được trạng thái từ chuỗi hợp lệ', () => {
    const status = SubscriptionStatus.fromString('Active');
    expect(status.value).toBe('Active');
    expect(status.isActive()).toBe(true);
  });

  it('nên ném lỗi khi tạo từ chuỗi không hợp lệ', () => {
    expect(() => {
      SubscriptionStatus.fromString('Invalid');
    }).toThrow('Invalid subscription status: Invalid');
  });

  it('isActive nên trả về đúng cho trạng thái Active', () => {
    const status = SubscriptionStatus.active();
    expect(status.isActive()).toBe(true);

    const suspendedStatus = SubscriptionStatus.suspended();
    expect(suspendedStatus.isActive()).toBe(false);
  });

  it('isSuspended nên trả về đúng cho trạng thái Suspended', () => {
    const status = SubscriptionStatus.suspended();
    expect(status.isSuspended()).toBe(true);

    const activeStatus = SubscriptionStatus.active();
    expect(activeStatus.isSuspended()).toBe(false);
  });

  it('isCancelled nên trả về đúng cho trạng thái Cancelled', () => {
    const status = SubscriptionStatus.cancelled();
    expect(status.isCancelled()).toBe(true);

    const activeStatus = SubscriptionStatus.active();
    expect(activeStatus.isCancelled()).toBe(false);
  });
});
