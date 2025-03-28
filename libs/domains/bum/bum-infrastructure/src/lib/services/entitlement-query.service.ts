import { Injectable } from '@nestjs/common';
import { ILogger } from '@ecoma/common-application';
import {
  OrganizationId,
  ISubscriptionRepository,
  IPricingPlanRepository,
  EntitlementCheckerService
} from '@ecoma/domains/bum/bum-domain';
import { IEntitlementQueryPort } from '@ecoma/domains/bum/bum-application';

/**
 * Service triển khai IEntitlementQueryPort sử dụng Domain Services
 */
@Injectable()
export class EntitlementQueryService implements IEntitlementQueryPort {
  private readonly entitlementChecker: EntitlementCheckerService;

  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly pricingPlanRepository: IPricingPlanRepository,
    private readonly logger: ILogger
  ) {
    this.entitlementChecker = new EntitlementCheckerService();
  }

  /**
   * Kiểm tra quyền sử dụng một tính năng
   * @param organizationId ID của tổ chức
   * @param featureType Loại tính năng cần kiểm tra
   */
  async checkFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean> {
    this.logger.debug(`Checking feature entitlement`, {
      organizationId,
      featureType
    });

    const orgId = new OrganizationId(organizationId);

    // Find the active subscription for the organization
    const subscription = await this.subscriptionRepository.findActiveByOrganizationId(orgId);

    if (!subscription) {
      this.logger.debug(`No active subscription found for organization ${organizationId}`);
      return false;
    }

    // Get the pricing plan for the subscription
    const pricingPlan = await this.pricingPlanRepository.findById(subscription.pricingPlanIdValue);

    if (!pricingPlan) {
      this.logger.error(`Pricing plan not found for ID ${subscription.pricingPlanIdValue.value}`);
      return false;
    }

    // Check the feature entitlement
    return this.entitlementChecker.checkFeatureEntitlement(
      subscription,
      pricingPlan,
      featureType
    );
  }

  /**
   * Kiểm tra quyền sử dụng một tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param requestedAmount Số lượng tài nguyên yêu cầu
   */
  async checkResourceEntitlement(
    organizationId: string,
    resourceType: string,
    requestedAmount: number
  ): Promise<boolean> {
    this.logger.debug(`Checking resource entitlement`, {
      organizationId,
      resourceType,
      requestedAmount
    });

    const orgId = new OrganizationId(organizationId);

    // Find the active subscription for the organization
    const subscription = await this.subscriptionRepository.findActiveByOrganizationId(orgId);

    if (!subscription) {
      this.logger.debug(`No active subscription found for organization ${organizationId}`);
      return false;
    }

    // Get the pricing plan for the subscription
    const pricingPlan = await this.pricingPlanRepository.findById(subscription.pricingPlanIdValue);

    if (!pricingPlan) {
      this.logger.error(`Pricing plan not found for ID ${subscription.pricingPlanIdValue.value}`);
      return false;
    }

    // For simplicity, assume current usage is 0
    // In a real implementation, you would get the current usage from a usage tracking service
    const currentUsage = 0;

    // Check the resource entitlement
    return this.entitlementChecker.checkResourceEntitlement(
      subscription,
      pricingPlan,
      resourceType,
      currentUsage,
      requestedAmount
    );
  }

  /**
   * Lấy giới hạn sử dụng của một loại tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   */
  async getResourceLimit(organizationId: string, resourceType: string): Promise<number | null> {
    this.logger.debug(`Getting resource limit`, {
      organizationId,
      resourceType
    });

    const orgId = new OrganizationId(organizationId);

    // Find the active subscription for the organization
    const subscription = await this.subscriptionRepository.findActiveByOrganizationId(orgId);

    if (!subscription) {
      this.logger.debug(`No active subscription found for organization ${organizationId}`);
      return null;
    }

    // Get the pricing plan for the subscription
    const pricingPlan = await this.pricingPlanRepository.findById(subscription.pricingPlanIdValue);

    if (!pricingPlan) {
      this.logger.error(`Pricing plan not found for ID ${subscription.pricingPlanIdValue.value}`);
      return null;
    }

    // Get the resource limit
    return this.entitlementChecker.getResourceLimit(
      pricingPlan,
      resourceType
    );
  }
}
