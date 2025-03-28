/**
 * DTO đại diện cho thông tin của một feature entitlement
 */
export interface IFeatureEntitlementDto {
  featureType: string;
  isEnabled: boolean;
}

/**
 * DTO đại diện cho thông tin của một resource entitlement
 */
export interface IResourceEntitlementDto {
  resourceType: string;
  limit: number;
}

/**
 * DTO đại diện cho thông tin cơ bản của một pricing plan
 */
export interface IPricingPlanDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  featureEntitlements: IFeatureEntitlementDto[];
  resourceEntitlements: IResourceEntitlementDto[];
  billingCycle: number;
}

/**
 * DTO sử dụng cho việc tạo mới pricing plan
 */
export interface ICreatePricingPlanDto {
  name: string;
  description: string;
  isActive: boolean;
  featureEntitlements: IFeatureEntitlementDto[];
  resourceEntitlements: IResourceEntitlementDto[];
  billingCycle: number;
}

/**
 * DTO sử dụng cho việc cập nhật pricing plan
 */
export interface IUpdatePricingPlanDto {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  billingCycle?: number;
}

/**
 * DTO sử dụng để quản lý feature entitlement của một pricing plan
 */
export interface IManageFeatureEntitlementDto {
  pricingPlanId: string;
  featureType: string;
  isEnabled: boolean;
}

/**
 * DTO sử dụng để quản lý resource entitlement của một pricing plan
 */
export interface IManageResourceEntitlementDto {
  pricingPlanId: string;
  resourceType: string;
  limit: number;
}
