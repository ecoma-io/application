/**
 * Đại diện cho phạm vi của quyền hạn trong hệ thống.
 * 
 * @since 1.0.0
 */
export enum PermissionScope {
  /**
   * Quyền hạn nội bộ Ecoma
   */
  INTERNAL = 'Internal',

  /**
   * Quyền hạn trong phạm vi một tổ chức khách hàng
   */
  ORGANIZATION = 'Organization'
} 