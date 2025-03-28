import { AbstractValueObject } from '@ecoma/common-domain';
import { PermissionScope } from './permission-scope.enum';

/**
 * Đại diện cho một quyền hạn cụ thể.
 */
export class Permission extends AbstractValueObject<Permission> {
  /**
   * Chuỗi định danh quyền hạn (ví dụ: "Product:View:Organization").
   */
  public readonly value: string;

  /**
   * Phạm vi của quyền hạn.
   */
  public readonly scope: PermissionScope;

  /**
   * Tạo một đối tượng Permission mới.
   * @param value - Chuỗi định danh quyền hạn
   * @param scope - Phạm vi của quyền hạn
   * @throws Error khi dữ liệu không hợp lệ
   */
  constructor(value: string, scope: PermissionScope) {
    super({
      value, 
      scope
    } as Permission);

    this.value = value;
    this.scope = scope;

    this.validate();
  }

  /**
   * Kiểm tra tính hợp lệ của quyền hạn.
   * @throws Error khi dữ liệu không hợp lệ
   */
  private validate(): void {
    if (!this.value || this.value.trim() === '') {
      throw new Error('Giá trị quyền hạn không được để trống');
    }

    // Kiểm tra định dạng: Resource:Action:Scope
    const permissionRegex = /^[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+$/;
    if (!permissionRegex.test(this.value)) {
      throw new Error('Định dạng quyền hạn không hợp lệ. Yêu cầu: Resource:Action:Scope');
    }

    // Đảm bảo rằng phần Scope trong chuỗi phù hợp với enum PermissionScope
    const permissionParts = this.value.split(':');
    if (permissionParts.length === 3) {
      const scopePart = permissionParts[2];
      if ((scopePart === 'Organization' && this.scope !== PermissionScope.ORGANIZATION) || 
          (scopePart === 'Internal' && this.scope !== PermissionScope.INTERNAL)) {
        throw new Error('Phạm vi trong chuỗi quyền hạn không khớp với phạm vi đã chỉ định');
      }
    }
  }
} 