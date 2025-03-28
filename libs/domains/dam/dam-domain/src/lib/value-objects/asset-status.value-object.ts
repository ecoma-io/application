/**
 * Định nghĩa các trạng thái có thể có của một tài sản trong hệ thống.
 *
 * @remarks
 * Trạng thái của tài sản thay đổi theo vòng đời của tài sản, từ khi đang tải lên đến khi xóa cứng.
 */
export enum AssetStatusEnum {
  /**
   * Tài sản đang trong quá trình tải lên, chưa hoàn tất.
   */
  UPLOADING = 'Uploading',

  /**
   * Tài sản đã tải lên hoàn tất và đang hoạt động bình thường.
   */
  ACTIVE = 'Active',

  /**
   * Tài sản đã bị vô hiệu hóa (không xóa) và không khả dụng để sử dụng.
   */
  INACTIVE = 'Inactive',

  /**
   * Tài sản đã bị xóa mềm, có thể khôi phục.
   */
  SOFT_DELETED = 'SoftDeleted',

  /**
   * Tài sản đã bị xóa cứng, không thể khôi phục.
   */
  HARD_DELETED = 'HardDeleted',
}

/**
 * Value Object đại diện cho trạng thái của một tài sản.
 */
export class AssetStatus {
  private readonly _value: AssetStatusEnum;

  /**
   * Khởi tạo một AssetStatus với giá trị cụ thể.
   *
   * @param value - Giá trị trạng thái, mặc định là UPLOADING
   */
  private constructor(value: AssetStatusEnum) {
    this._value = value;
  }

  /**
   * Lấy giá trị của trạng thái.
   */
  get value(): AssetStatusEnum {
    return this._value;
  }

  /**
   * Tạo trạng thái UPLOADING.
   *
   * @returns AssetStatus với giá trị UPLOADING
   */
  public static uploading(): AssetStatus {
    return new AssetStatus(AssetStatusEnum.UPLOADING);
  }

  /**
   * Tạo trạng thái ACTIVE.
   *
   * @returns AssetStatus với giá trị ACTIVE
   */
  public static active(): AssetStatus {
    return new AssetStatus(AssetStatusEnum.ACTIVE);
  }

  /**
   * Tạo trạng thái INACTIVE.
   *
   * @returns AssetStatus với giá trị INACTIVE
   */
  public static inactive(): AssetStatus {
    return new AssetStatus(AssetStatusEnum.INACTIVE);
  }

  /**
   * Tạo trạng thái SOFT_DELETED.
   *
   * @returns AssetStatus với giá trị SOFT_DELETED
   */
  public static softDeleted(): AssetStatus {
    return new AssetStatus(AssetStatusEnum.SOFT_DELETED);
  }

  /**
   * Tạo trạng thái HARD_DELETED.
   *
   * @returns AssetStatus với giá trị HARD_DELETED
   */
  public static hardDeleted(): AssetStatus {
    return new AssetStatus(AssetStatusEnum.HARD_DELETED);
  }

  /**
   * Tạo AssetStatus từ giá trị string.
   *
   * @param value - Giá trị string của trạng thái
   * @returns AssetStatus tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): AssetStatus {
    switch (value) {
      case AssetStatusEnum.UPLOADING:
        return this.uploading();
      case AssetStatusEnum.ACTIVE:
        return this.active();
      case AssetStatusEnum.INACTIVE:
        return this.inactive();
      case AssetStatusEnum.SOFT_DELETED:
        return this.softDeleted();
      case AssetStatusEnum.HARD_DELETED:
        return this.hardDeleted();
      default:
        throw new Error(`Giá trị trạng thái tài sản không hợp lệ: ${value}`);
    }
  }

  /**
   * Kiểm tra xem tài sản có thể xem được hay không.
   *
   * @returns true nếu tài sản có thể xem
   */
  public isViewable(): boolean {
    return this._value === AssetStatusEnum.ACTIVE ||
           this._value === AssetStatusEnum.INACTIVE;
  }

  /**
   * Kiểm tra xem tài sản có thể chỉnh sửa được hay không.
   *
   * @returns true nếu tài sản có thể chỉnh sửa
   */
  public isEditable(): boolean {
    return this._value === AssetStatusEnum.ACTIVE;
  }

  /**
   * Kiểm tra xem tài sản có thể khôi phục được hay không.
   *
   * @returns true nếu tài sản có thể khôi phục
   */
  public isRestorable(): boolean {
    return this._value === AssetStatusEnum.SOFT_DELETED;
  }

  /**
   * So sánh hai AssetStatus.
   *
   * @param other - AssetStatus khác để so sánh
   * @returns true nếu hai AssetStatus có cùng giá trị
   */
  public equals(other: AssetStatus): boolean {
    return this._value === other.value;
  }

  /**
   * Chuyển đổi AssetStatus thành chuỗi.
   *
   * @returns Chuỗi đại diện cho AssetStatus
   */
  public toString(): string {
    return this._value;
  }
}
