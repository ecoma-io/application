import { Subscription } from '../aggregates/subscription.aggregate';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';

/**
 * Interface định nghĩa các phương thức quản lý và truy vấn Subscription
 */
export interface ISubscriptionRepository {
  /**
   * Tìm subscription theo ID
   * @param id ID của subscription cần tìm
   */
  findById(id: SubscriptionId): Promise<Subscription | null>;

  /**
   * Tìm subscription theo tổ chức
   * @param organizationId ID của tổ chức
   */
  findByOrganizationId(organizationId: OrganizationId): Promise<Subscription[]>;

  /**
   * Tìm subscription đang active của tổ chức
   * @param organizationId ID của tổ chức
   */
  findActiveByOrganizationId(organizationId: OrganizationId): Promise<Subscription | null>;

  /**
   * Lưu subscription mới hoặc cập nhật subscription đã tồn tại
   * @param subscription Subscription cần lưu
   */
  save(subscription: Subscription): Promise<void>;

  /**
   * Xóa subscription
   * @param id ID của subscription cần xóa
   */
  delete(id: SubscriptionId): Promise<void>;
}
