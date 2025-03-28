/**
 * Định nghĩa các loại quyền truy cập có thể có đối với tài sản và thư mục trong hệ thống.
 *
 * @remarks
 * Các quyền này được sử dụng để kiểm soát quyền truy cập của người dùng hoặc hệ thống
 * khi tương tác với tài sản hoặc thư mục trong DAM.
 */
export enum AccessPermissionEnum {
  /**
   * Quyền xem tài sản/thư mục.
   */
  VIEW = 'View',

  /**
   * Quyền tải xuống tài sản.
   */
  DOWNLOAD = 'Download',

  /**
   * Quyền chỉnh sửa tài sản/thư mục (cập nhật metadata, đổi tên thư mục).
   */
  EDIT = 'Edit',

  /**
   * Quyền xóa tài sản/thư mục.
   */
  DELETE = 'Delete',

  /**
   * Quyền quản lý quyền truy cập cho tài sản/thư mục.
   */
  MANAGE_PERMISSIONS = 'ManagePermissions',
}

/**
 * Value Object đại diện cho một quyền truy cập.
 */
export class AccessPermission {
  private readonly _value: AccessPermissionEnum;

  /**
   * Khởi tạo một AccessPermission với giá trị cụ thể.
   *
   * @param value - Giá trị quyền truy cập
   */
  private constructor(value: AccessPermissionEnum) {
    this._value = value;
  }

  /**
   * Lấy giá trị của quyền truy cập.
   */
  get value(): AccessPermissionEnum {
    return this._value;
  }

  /**
   * Tạo quyền VIEW.
   *
   * @returns AccessPermission với giá trị VIEW
   */
  public static view(): AccessPermission {
    return new AccessPermission(AccessPermissionEnum.VIEW);
  }

  /**
   * Tạo quyền DOWNLOAD.
   *
   * @returns AccessPermission với giá trị DOWNLOAD
   */
  public static download(): AccessPermission {
    return new AccessPermission(AccessPermissionEnum.DOWNLOAD);
  }

  /**
   * Tạo quyền EDIT.
   *
   * @returns AccessPermission với giá trị EDIT
   */
  public static edit(): AccessPermission {
    return new AccessPermission(AccessPermissionEnum.EDIT);
  }

  /**
   * Tạo quyền DELETE.
   *
   * @returns AccessPermission với giá trị DELETE
   */
  public static delete(): AccessPermission {
    return new AccessPermission(AccessPermissionEnum.DELETE);
  }

  /**
   * Tạo quyền MANAGE_PERMISSIONS.
   *
   * @returns AccessPermission với giá trị MANAGE_PERMISSIONS
   */
  public static managePermissions(): AccessPermission {
    return new AccessPermission(AccessPermissionEnum.MANAGE_PERMISSIONS);
  }

  /**
   * Tạo AccessPermission từ giá trị string.
   *
   * @param value - Giá trị string của quyền truy cập
   * @returns AccessPermission tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): AccessPermission {
    switch (value) {
      case AccessPermissionEnum.VIEW:
        return this.view();
      case AccessPermissionEnum.DOWNLOAD:
        return this.download();
      case AccessPermissionEnum.EDIT:
        return this.edit();
      case AccessPermissionEnum.DELETE:
        return this.delete();
      case AccessPermissionEnum.MANAGE_PERMISSIONS:
        return this.managePermissions();
      default:
        throw new Error(`Giá trị quyền truy cập không hợp lệ: ${value}`);
    }
  }

  /**
   * So sánh hai AccessPermission.
   *
   * @param other - AccessPermission khác để so sánh
   * @returns true nếu hai AccessPermission có cùng giá trị
   */
  public equals(other: AccessPermission): boolean {
    return this._value === other.value;
  }

  /**
   * Chuyển đổi AccessPermission thành chuỗi.
   *
   * @returns Chuỗi đại diện cho AccessPermission
   */
  public toString(): string {
    return this._value;
  }
}
