/**
 * DTO đại diện cho thông tin cơ bản của một subscription
 */
export interface ISubscriptionDto {
  id: string;
  organizationId: string;
  pricingPlanId: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

/**
 * DTO sử dụng cho việc tạo mới subscription
 */
export interface ICreateSubscriptionDto {
  organizationId: string;
  pricingPlanId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

/**
 * DTO sử dụng cho việc cập nhật subscription
 */
export interface IUpdateSubscriptionDto {
  id: string;
  pricingPlanId?: string;
  endDate?: string;
  autoRenew?: boolean;
}

/**
 * DTO sử dụng để thay đổi trạng thái subscription
 */
export interface IChangeSubscriptionStatusDto {
  id: string;
  status: 'Active' | 'Suspended' | 'Cancelled' | 'PendingPayment' | 'TrialPeriod';
  reason?: string;
}
