import { PricingPlan } from '../aggregates/pricing-plan.aggregate';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';

/**
 * Interface định nghĩa các phương thức quản lý và truy vấn PricingPlan
 */
export interface IPricingPlanRepository {
  /**
   * Tìm pricing plan theo ID
   * @param id ID của pricing plan cần tìm
   */
  findById(id: PricingPlanId): Promise<PricingPlan | null>;

  /**
   * Tìm tất cả các pricing plan
   */
  findAll(): Promise<PricingPlan[]>;

  /**
   * Tìm tất cả các pricing plan đang active
   */
  findAllActive(): Promise<PricingPlan[]>;

  /**
   * Lưu pricing plan mới hoặc cập nhật pricing plan đã tồn tại
   * @param pricingPlan Pricing plan cần lưu
   */
  save(pricingPlan: PricingPlan): Promise<void>;

  /**
   * Xóa pricing plan
   * @param id ID của pricing plan cần xóa
   */
  delete(id: PricingPlanId): Promise<void>;
}
