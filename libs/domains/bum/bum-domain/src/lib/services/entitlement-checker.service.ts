import { Subscription } from '../aggregates/subscription.aggregate';
import { PricingPlan } from '../aggregates/pricing-plan.aggregate';

/**
 * Service miền cung cấp các phương thức để kiểm tra quyền lợi (entitlement)
 */
export class EntitlementCheckerService {
  /**
   * Kiểm tra xem subscription có quyền sử dụng một tính năng cụ thể không
   * @param subscription Subscription cần kiểm tra
   * @param pricingPlan PricingPlan áp dụng cho subscription
   * @param featureType Loại tính năng cần kiểm tra
   * @returns true nếu có quyền, false nếu không
   */
  public checkFeatureEntitlement(
    subscription: Subscription,
    pricingPlan: PricingPlan,
    featureType: string
  ): boolean {
    // Kiểm tra subscription có active không
    if (!subscription.statusValue.isActive()) {
      return false;
    }

    // Kiểm tra subscription có đúng với pricing plan đang xét không
    if (!subscription.pricingPlanIdValue.equals(pricingPlan.pricingPlanId)) {
      return false;
    }

    // Kiểm tra tính năng có được hỗ trợ trong plan không
    return pricingPlan.hasFeature(featureType);
  }

  /**
   * Kiểm tra xem subscription có quyền sử dụng một lượng tài nguyên cụ thể không
   * @param subscription Subscription cần kiểm tra
   * @param pricingPlan PricingPlan áp dụng cho subscription
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param currentUsage Lượng sử dụng hiện tại
   * @param additionalUsage Lượng sử dụng thêm cần kiểm tra
   * @returns true nếu có quyền, false nếu không
   */
  public checkResourceEntitlement(
    subscription: Subscription,
    pricingPlan: PricingPlan,
    resourceType: string,
    currentUsage: number,
    additionalUsage: number
  ): boolean {
    // Kiểm tra subscription có active không
    if (!subscription.statusValue.isActive()) {
      return false;
    }

    // Kiểm tra subscription có đúng với pricing plan đang xét không
    if (!subscription.pricingPlanIdValue.equals(pricingPlan.pricingPlanId)) {
      return false;
    }

    // Lấy giới hạn tài nguyên
    const limit = pricingPlan.getResourceLimit(resourceType);

    // Nếu không tìm thấy giới hạn hoặc giới hạn là null, không cho phép sử dụng
    if (limit === null) {
      return false;
    }

    // Kiểm tra xem lượng sử dụng hiện tại + lượng thêm có vượt quá giới hạn không
    return (currentUsage + additionalUsage) <= limit;
  }

  /**
   * Lấy giới hạn của một loại tài nguyên
   * @param pricingPlan PricingPlan cần kiểm tra
   * @param resourceType Loại tài nguyên cần lấy giới hạn
   * @returns Giới hạn tài nguyên hoặc null nếu không tìm thấy
   */
  public getResourceLimit(
    pricingPlan: PricingPlan,
    resourceType: string
  ): number | null {
    return pricingPlan.getResourceLimit(resourceType);
  }
}
