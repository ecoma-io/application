import { AbstractAggregate } from '@ecoma/common-domain';
import { PermissionScope } from '../value-objects/permission-scope.enum';
import { StringId } from '../value-objects/string-id.value-object';

/**
 * Aggregate Root đại diện cho một định nghĩa quyền hạn trong hệ thống.
 * 
 * @since 1.0.0
 */
export class PermissionDefinition extends AbstractAggregate<StringId> {
  /**
   * Giá trị của quyền hạn (ví dụ: "Product:View:Organization").
   */
  private value: string;

  /**
   * Mô tả của quyền hạn.
   */
  private description: string;

  /**
   * Phạm vi của quyền hạn (Internal hoặc Organization).
   */
  private scope: PermissionScope;

  /**
   * ID của quyền hạn cha (nếu có).
   */
  private parentPermissionId: string | null;

  /**
   * Thời điểm tạo quyền hạn.
   */
  private createdAt: Date;

  /**
   * Tên kỹ thuật của quyền, dùng trong code (ví dụ: 'read:users').
   */
  private name: string;

  /**
   * Tiêu đề hiển thị của quyền (ví dụ: 'Xem danh sách người dùng').
   */
  private displayName: string;

  /**
   * Tên nhóm quyền để phân loại UI.
   */
  private groupName: string;

  /**
   * Cờ đánh dấu xem quyền này có sẵn dùng trong hệ thống nội bộ hay không.
   */
  private isInternalPermission: boolean;

  /**
   * Cờ đánh dấu xem quyền này có sẵn dùng cho tổ chức khách hàng hay không.
   */
  private isOrganizationPermission: boolean;

  /**
   * Khởi tạo một instance mới của PermissionDefinition.
   * 
   * @param id - ID duy nhất của định nghĩa quyền
   * @param value - Giá trị của quyền hạn
   * @param description - Mô tả của quyền hạn
   * @param scope - Phạm vi của quyền hạn
   * @param parentPermissionId - ID của quyền hạn cha (nếu có)
   * @param createdAt - Thời điểm tạo quyền hạn
   * @param name - Tên kỹ thuật của quyền
   * @param displayName - Tiêu đề hiển thị của quyền
   * @param groupName - Tên nhóm quyền
   * @param isInternalPermission - Cờ đánh dấu quyền dùng nội bộ
   * @param isOrganizationPermission - Cờ đánh dấu quyền dùng cho tổ chức
   */
  constructor(
    id: string,
    value: string,
    description: string,
    scope: PermissionScope,
    parentPermissionId: string | null = null,
    createdAt: Date = new Date(),
    name: string,
    displayName: string,
    groupName: string,
    isInternalPermission = true,
    isOrganizationPermission = true
  ) {
    super(new StringId(id));
    this.value = value;
    this.description = description;
    this.scope = scope;
    this.parentPermissionId = parentPermissionId;
    this.createdAt = createdAt;
    this.name = name;
    this.displayName = displayName;
    this.groupName = groupName;
    this.isInternalPermission = isInternalPermission;
    this.isOrganizationPermission = isOrganizationPermission;

    this.validateState();
  }

  /**
   * Lấy giá trị ID dưới dạng chuỗi.
   */
  get idValue(): string {
    return this.id.value;
  }

  /**
   * Lấy giá trị của quyền hạn.
   */
  get getValue(): string {
    return this.value;
  }

  /**
   * Lấy mô tả của quyền hạn.
   */
  get getDescription(): string {
    return this.description;
  }

  /**
   * Lấy phạm vi của quyền hạn.
   */
  get getScope(): PermissionScope {
    return this.scope;
  }

  /**
   * Lấy ID của quyền hạn cha.
   */
  get getParentPermissionId(): string | null {
    return this.parentPermissionId;
  }

  /**
   * Lấy thời điểm tạo quyền hạn.
   */
  get getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  /**
   * Lấy tên kỹ thuật của quyền.
   */
  get getName(): string {
    return this.name;
  }

  /**
   * Lấy tiêu đề hiển thị của quyền.
   */
  get getDisplayName(): string {
    return this.displayName;
  }

  /**
   * Lấy tên nhóm quyền.
   */
  get getGroupName(): string {
    return this.groupName;
  }

  /**
   * Kiểm tra xem quyền này có dùng cho hệ thống nội bộ hay không.
   */
  get getIsInternalPermission(): boolean {
    return this.isInternalPermission;
  }

  /**
   * Kiểm tra xem quyền này có dùng cho tổ chức khách hàng hay không.
   */
  get getIsOrganizationPermission(): boolean {
    return this.isOrganizationPermission;
  }

  /**
   * Cập nhật thông tin của định nghĩa quyền.
   * 
   * @param displayName - Tiêu đề hiển thị mới
   * @param description - Mô tả chi tiết mới
   * @param groupName - Tên nhóm quyền mới
   * @param isInternalPermission - Cờ đánh dấu quyền dùng nội bộ mới
   * @param isOrganizationPermission - Cờ đánh dấu quyền dùng cho tổ chức mới
   */
  public update(
    displayName: string,
    description: string,
    groupName: string,
    isInternalPermission: boolean,
    isOrganizationPermission: boolean
  ): void {
    this.displayName = displayName;
    this.description = description;
    this.groupName = groupName;
    this.isInternalPermission = isInternalPermission;
    this.isOrganizationPermission = isOrganizationPermission;

    this.validateState();
  }

  /**
   * Kiểm tra tính hợp lệ của trạng thái.
   * 
   * @throws Error - Nếu trạng thái không hợp lệ
   */
  private validateState(): void {
    if (!this.value) {
      throw new Error('Giá trị quyền hạn không được để trống');
    }

    if (!this.description) {
      throw new Error('Mô tả quyền hạn không được để trống');
    }

    // Kiểm tra định dạng của giá trị quyền hạn (Resource:Action:Scope)
    const parts = this.value.split(':');
    if (parts.length !== 3) {
      throw new Error('Giá trị quyền hạn phải có định dạng Resource:Action:Scope');
    }

    const scopePart = parts[2];
    if (this.scope === PermissionScope.ORGANIZATION && scopePart !== PermissionScope.ORGANIZATION) {
      throw new Error('Phạm vi quyền hạn không khớp với giá trị');
    }

    if (this.scope === PermissionScope.INTERNAL && scopePart !== PermissionScope.INTERNAL) {
      throw new Error('Phạm vi quyền hạn không khớp với giá trị');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Tên kỹ thuật của quyền không được để trống');
    }

    if (!this.displayName || this.displayName.trim() === '') {
      throw new Error('Tiêu đề hiển thị của quyền không được để trống');
    }

    if (!this.groupName || this.groupName.trim() === '') {
      throw new Error('Tên nhóm quyền không được để trống');
    }

    if (!this.isInternalPermission && !this.isOrganizationPermission) {
      throw new Error('Quyền phải được kích hoạt cho ít nhất một phạm vi (nội bộ hoặc tổ chức)');
    }
  }
} 