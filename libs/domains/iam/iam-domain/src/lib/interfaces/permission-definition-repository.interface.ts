import { IRepository } from '@ecoma/common-domain';
import { PermissionDefinition } from '../aggregates/permission-definition.aggregate';
import { PermissionScope } from '../value-objects';

/**
 * Interface cho repository quản lý PermissionDefinition Aggregate.
 *
 * @since 1.0.0
 */
export interface IPermissionDefinitionRepository extends IRepository<any, PermissionDefinition> {
  /**
   * Tìm kiếm PermissionDefinition theo giá trị.
   *
   * @param value - Giá trị của quyền hạn (ví dụ: "Product:View:Organization")
   * @returns Promise chứa PermissionDefinition nếu tìm thấy, null nếu không
   */
  findByValue(value: string): Promise<PermissionDefinition | null>;

  /**
   * Tìm tất cả các PermissionDefinition theo phạm vi.
   *
   * @param scope - Phạm vi của quyền hạn
   * @returns Promise chứa danh sách các PermissionDefinition
   */
  findByScope(scope: PermissionScope): Promise<PermissionDefinition[]>;

  /**
   * Tìm tất cả các PermissionDefinition con của một quyền hạn cha.
   *
   * @param parentId - ID của quyền hạn cha
   * @returns Promise chứa danh sách các PermissionDefinition con
   */
  findByParentId(parentId: string): Promise<PermissionDefinition[]>;

  /**
   * Tìm tất cả các quyền hạn gốc (không có quyền cha).
   *
   * @param scope - Phạm vi của quyền hạn (tùy chọn)
   * @returns Promise chứa danh sách các PermissionDefinition gốc
   */
  findRootPermissions(scope?: PermissionScope): Promise<PermissionDefinition[]>;
}
