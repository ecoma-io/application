import { IRepository } from '@ecoma/common-domain';
import { Role } from '../aggregates/role.aggregate';
import { RoleScope } from '../value-objects';

/**
 * Interface cho repository quản lý Role Aggregate.
 *
 * @since 1.0.0
 */
export interface IRoleRepository extends IRepository<any, Role> {
  /**
   * Tìm kiếm Role theo tên và phạm vi.
   *
   * @param name - Tên vai trò cần tìm
   * @param scope - Phạm vi vai trò (Internal hoặc Organization)
   * @param organizationId - ID của tổ chức (chỉ cần thiết khi scope là Organization)
   * @returns Promise chứa Role nếu tìm thấy, null nếu không
   */
  findByNameAndScope(name: string, scope: RoleScope, organizationId?: string): Promise<Role | null>;

  /**
   * Tìm tất cả các vai trò thuộc một tổ chức.
   *
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa danh sách các vai trò
   */
  findByOrganizationId(organizationId: string): Promise<Role[]>;

  /**
   * Tìm tất cả các vai trò hệ thống (nội bộ).
   *
   * @returns Promise chứa danh sách các vai trò hệ thống
   */
  findSystemRoles(): Promise<Role[]>;
}
