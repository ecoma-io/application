import { IRepository } from '@ecoma/common-domain';
import { Organization } from '../aggregates/organization.aggregate';
import { OrganizationSlug } from '../value-objects';

/**
 * Interface cho repository quản lý Organization Aggregate.
 */
export interface IOrganizationRepository extends IRepository<any, Organization> {
  /**
   * Tìm kiếm Organization theo tên.
   * @param name - Tên tổ chức cần tìm
   * @returns Promise chứa Organization nếu tìm thấy, null nếu không
   */
  findByName(name: string): Promise<Organization | null>;

  /**
   * Tìm kiếm Organization theo slug.
   * @param slug - Slug tổ chức cần tìm
   * @returns Promise chứa Organization nếu tìm thấy, null nếu không
   */
  findBySlug(slug: OrganizationSlug): Promise<Organization | null>;

  /**
   * Kiểm tra xem slug đã tồn tại chưa.
   * @param slug - Slug cần kiểm tra
   * @returns Promise<boolean> - true nếu slug đã tồn tại, false nếu chưa
   */
  existsBySlug(slug: OrganizationSlug): Promise<boolean>;
}
