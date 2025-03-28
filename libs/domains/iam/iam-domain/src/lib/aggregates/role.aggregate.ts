import { AbstractAggregate } from '@ecoma/common-domain';
import { Permission } from '../value-objects/permission.value-object';
import { RoleScope } from '../value-objects/role-scope.enum';
import { StringId } from '../value-objects/string-id.value-object';

/**
 * Aggregate Root đại diện cho một vai trò trong hệ thống.
 * 
 * @since 1.0.0
 */
export class Role extends AbstractAggregate<StringId> {
  /**
   * Tên của vai trò.
   */
  private name: string;

  /**
   * Mô tả của vai trò.
   */
  private description: string;

  /**
   * Phạm vi của vai trò (Internal hoặc Organization).
   */
  private scope: RoleScope;

  /**
   * ID của tổ chức mà vai trò thuộc về (chỉ áp dụng cho vai trò phạm vi Organization).
   */
  private organizationId: string | null;

  /**
   * Danh sách các quyền hạn được gán cho vai trò.
   */
  private permissions: Permission[];

  /**
   * Vai trò có phải là vai trò hệ thống không (không thể xóa).
   */
  private isSystemRole: boolean;

  /**
   * Thời điểm tạo vai trò.
   */
  private createdAt: Date;

  /**
   * Thời điểm cập nhật vai trò gần nhất.
   */
  private updatedAt: Date;

  /**
   * Khởi tạo một instance mới của Role.
   * 
   * @param id - ID duy nhất của vai trò
   * @param name - Tên của vai trò
   * @param description - Mô tả của vai trò
   * @param scope - Phạm vi của vai trò
   * @param organizationId - ID của tổ chức (chỉ áp dụng cho vai trò phạm vi Organization)
   * @param permissions - Danh sách các quyền hạn được gán cho vai trò
   * @param isSystemRole - Vai trò có phải là vai trò hệ thống không
   * @param createdAt - Thời điểm tạo vai trò
   * @param updatedAt - Thời điểm cập nhật vai trò gần nhất
   */
  constructor(
    id: string,
    name: string,
    description: string,
    scope: RoleScope,
    organizationId: string | null,
    permissions: Permission[] = [],
    isSystemRole = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(new StringId(id));
    this.name = name;
    this.description = description;
    this.scope = scope;
    this.organizationId = organizationId;
    this.permissions = [...permissions];
    this.isSystemRole = isSystemRole;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validateState();
  }

  /**
   * Lấy giá trị ID dưới dạng chuỗi.
   */
  get idValue(): string {
    return this.id.value;
  }

  /**
   * Lấy tên của vai trò.
   */
  get getName(): string {
    return this.name;
  }

  /**
   * Lấy mô tả của vai trò.
   */
  get getDescription(): string {
    return this.description;
  }

  /**
   * Lấy phạm vi của vai trò.
   */
  get getScope(): RoleScope {
    return this.scope;
  }

  /**
   * Lấy ID của tổ chức mà vai trò thuộc về.
   */
  get getOrganizationId(): string | null {
    return this.organizationId;
  }

  /**
   * Lấy danh sách các quyền hạn được gán cho vai trò.
   */
  get getPermissions(): Permission[] {
    return [...this.permissions];
  }

  /**
   * Kiểm tra xem vai trò có phải là vai trò hệ thống không.
   */
  get getIsSystemRole(): boolean {
    return this.isSystemRole;
  }

  /**
   * Lấy thời điểm tạo vai trò.
   */
  get getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  /**
   * Lấy thời điểm cập nhật vai trò gần nhất.
   */
  get getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  /**
   * Cập nhật thông tin vai trò.
   * 
   * @param name - Tên mới của vai trò
   * @param description - Mô tả mới của vai trò
   * @throws Error - Nếu vai trò là vai trò hệ thống hoặc thông tin không hợp lệ
   */
  public updateDetails(name: string, description: string): void {
    if (this.isSystemRole) {
      throw new Error('Không thể cập nhật vai trò hệ thống');
    }

    if (!name || name.trim().length === 0) {
      throw new Error('Tên vai trò không được để trống');
    }

    this.name = name;
    this.description = description;
    this.updatedAt = new Date();
  }

  /**
   * Thêm quyền hạn cho vai trò.
   * 
   * @param permission - Quyền hạn cần thêm
   * @throws Error - Nếu vai trò là vai trò hệ thống hoặc quyền hạn đã tồn tại
   */
  public addPermission(permission: Permission): void {
    if (this.isSystemRole) {
      throw new Error('Không thể thay đổi quyền hạn của vai trò hệ thống');
    }

    // Kiểm tra xem quyền hạn đã tồn tại chưa
    if (this.hasPermission(permission.value)) {
      throw new Error('Quyền hạn đã tồn tại trong vai trò');
    }

    // Kiểm tra tính tương thích của phạm vi quyền hạn
    if (
      (this.scope === RoleScope.ORGANIZATION && !permission.value.endsWith(':Organization')) ||
      (this.scope === RoleScope.INTERNAL && !permission.value.endsWith(':Internal'))
    ) {
      throw new Error('Phạm vi quyền hạn không tương thích với phạm vi vai trò');
    }

    this.permissions.push(permission);
    this.updatedAt = new Date();
  }

  /**
   * Xóa quyền hạn khỏi vai trò.
   * 
   * @param permissionValue - Giá trị của quyền hạn cần xóa
   * @throws Error - Nếu vai trò là vai trò hệ thống hoặc quyền hạn không tồn tại
   */
  public removePermission(permissionValue: string): void {
    if (this.isSystemRole) {
      throw new Error('Không thể thay đổi quyền hạn của vai trò hệ thống');
    }

    const initialLength = this.permissions.length;
    this.permissions = this.permissions.filter(p => p.value !== permissionValue);

    if (this.permissions.length === initialLength) {
      throw new Error('Quyền hạn không tồn tại trong vai trò');
    }

    this.updatedAt = new Date();
  }

  /**
   * Kiểm tra xem vai trò có quyền hạn cụ thể không.
   * 
   * @param permissionValue - Giá trị của quyền hạn cần kiểm tra
   * @returns true nếu vai trò có quyền hạn, ngược lại false
   */
  public hasPermission(permissionValue: string): boolean {
    return this.permissions.some(p => p.value === permissionValue);
  }

  /**
   * Kiểm tra tính hợp lệ của trạng thái.
   * 
   * @throws Error - Nếu trạng thái không hợp lệ
   */
  private validateState(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Tên vai trò không được để trống');
    }

    if (this.scope === RoleScope.ORGANIZATION && !this.organizationId) {
      throw new Error('ID tổ chức không được để trống cho vai trò phạm vi Organization');
    }

    if (this.scope === RoleScope.INTERNAL && this.organizationId) {
      throw new Error('Vai trò phạm vi Internal không được có ID tổ chức');
    }

    // Kiểm tra tính tương thích của phạm vi quyền hạn
    for (const permission of this.permissions) {
      if (
        (this.scope === RoleScope.ORGANIZATION && !permission.value.endsWith(':Organization')) ||
        (this.scope === RoleScope.INTERNAL && !permission.value.endsWith(':Internal'))
      ) {
        throw new Error('Phạm vi quyền hạn không tương thích với phạm vi vai trò');
      }
    }
  }
} 