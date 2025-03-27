import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi không tìm thấy subscription với ID được chỉ định.
 * @extends {DomainError}
 */
export class SubscriptionNotFoundError extends DomainError {
  constructor(subscriptionId: string) {
    super("Subscription {subscriptionId} not found", { subscriptionId });
  }
}

/**
 * Đại diện cho lỗi khi subscription đã hết thời hạn sử dụng.
 * @extends {DomainError}
 */
export class SubscriptionExpiredError extends DomainError {
  constructor(subscriptionId: string) {
    super("Subscription {subscriptionId} has expired", { subscriptionId });
  }
}

/**
 * Đại diện cho lỗi khi subscription đang trong trạng thái tạm ngưng.
 * @extends {DomainError}
 */
export class SubscriptionSuspendedError extends DomainError {
  constructor(subscriptionId: string) {
    super("Subscription {subscriptionId} is suspended", { subscriptionId });
  }
}

/**
 * Đại diện cho lỗi khi không thể thay đổi gói subscription vì lý do cụ thể.
 * @extends {DomainError}
 */
export class CannotChangePlanError extends DomainError {
  constructor(subscriptionId: string, reason: string) {
    super(
      "Cannot change plan for subscription {subscriptionId}. Reason: {reason}",
      { subscriptionId, reason }
    );
  }
}

/**
 * Đại diện cho lỗi khi không tìm thấy gói subscription với ID được chỉ định.
 * @extends {DomainError}
 */
export class PricingPlanNotFoundError extends DomainError {
  constructor(planId: string) {
    super("Pricing plan {planId} not found", { planId });
  }
}

/**
 * Đại diện cho lỗi khi gói subscription không khả dụng để đăng ký hoặc nâng cấp.
 * @extends {DomainError}
 */
export class PricingPlanNotAvailableError extends DomainError {
  constructor(planId: string) {
    super("Pricing plan {planId} is not available", { planId });
  }
}

/**
 * Đại diện cho lỗi khi không thể hủy subscription vì lý do cụ thể.
 * @extends {DomainError}
 */
export class CannotCancelSubscriptionError extends DomainError {
  constructor(subscriptionId: string, reason: string) {
    super("Cannot cancel subscription {subscriptionId}. Reason: {reason}", {
      subscriptionId,
      reason,
    });
  }
}

/**
 * Đại diện cho lỗi khi không thể gia hạn subscription vì lý do cụ thể.
 * @extends {DomainError}
 */
export class CannotRenewSubscriptionError extends DomainError {
  constructor(subscriptionId: string, reason: string) {
    super("Cannot renew subscription {subscriptionId}. Reason: {reason}", {
      subscriptionId,
      reason,
    });
  }
}
