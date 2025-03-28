import { IRepository } from '@ecoma/common-domain';
import { Membership } from '../entities/membership.entity';

/**
 * Interface cho repository quản lý Membership Entity.
 *
 * @since 1.0.0
 */
export interface IMembershipRepository extends IRepository<any, Membership> {
  /**
   * Tìm kiếm Membership theo user ID.
   * @param userId - ID của người dùng
   * @returns Promise chứa danh sách các Membership
   */
  findByUserId(userId: string): Promise<Membership[]>;

  /**
   * Tìm kiếm Membership theo organization ID.
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa danh sách các Membership
   */
  findByOrganizationId(organizationId: string): Promise<Membership[]>;

  /**
   * Tìm kiếm Membership theo user ID và organization ID.
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa Membership nếu tìm thấy, null nếu không
   */
  findByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<Membership | null>;

  /**
   * Tìm kiếm các Membership nội bộ.
   * @returns Promise chứa danh sách các Membership nội bộ
   */
  findInternalMemberships(): Promise<Membership[]>;
}
