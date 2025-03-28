/**
 * Định nghĩa các loại phiên bản (rendition) có thể có của một tài sản trong hệ thống.
 *
 * @remarks
 * Các loại phiên bản đại diện cho các biến thể với kích thước và mục đích sử dụng khác nhau
 * của cùng một tài sản gốc. Ví dụ: thumbnail, ảnh nhỏ, ảnh trung bình, ảnh lớn.
 */
export enum RenditionTypeEnum {
  /**
   * Phiên bản thumbnail, kích thước rất nhỏ để hiển thị ảnh đại diện.
   */
  THUMBNAIL = 'Thumbnail',

  /**
   * Phiên bản kích thước nhỏ, sử dụng cho hiển thị trong danh sách, grid.
   */
  SMALL = 'Small',

  /**
   * Phiên bản kích thước trung bình, sử dụng cho hiển thị chi tiết.
   */
  MEDIUM = 'Medium',

  /**
   * Phiên bản kích thước lớn, sử dụng cho xem đầy đủ.
   */
  LARGE = 'Large',

  /**
   * Phiên bản tùy chỉnh, có thể có các thông số đặc biệt.
   */
  CUSTOM = 'Custom',
}

/**
 * Value Object đại diện cho loại phiên bản của một tài sản.
 */
export class RenditionType {
  private readonly _value: RenditionTypeEnum;

  /**
   * Khởi tạo một RenditionType với giá trị cụ thể.
   *
   * @param value - Giá trị loại phiên bản
   */
  private constructor(value: RenditionTypeEnum) {
    this._value = value;
  }

  /**
   * Lấy giá trị của loại phiên bản.
   */
  get value(): RenditionTypeEnum {
    return this._value;
  }

  /**
   * Tạo loại phiên bản THUMBNAIL.
   *
   * @returns RenditionType với giá trị THUMBNAIL
   */
  public static thumbnail(): RenditionType {
    return new RenditionType(RenditionTypeEnum.THUMBNAIL);
  }

  /**
   * Tạo loại phiên bản SMALL.
   *
   * @returns RenditionType với giá trị SMALL
   */
  public static small(): RenditionType {
    return new RenditionType(RenditionTypeEnum.SMALL);
  }

  /**
   * Tạo loại phiên bản MEDIUM.
   *
   * @returns RenditionType với giá trị MEDIUM
   */
  public static medium(): RenditionType {
    return new RenditionType(RenditionTypeEnum.MEDIUM);
  }

  /**
   * Tạo loại phiên bản LARGE.
   *
   * @returns RenditionType với giá trị LARGE
   */
  public static large(): RenditionType {
    return new RenditionType(RenditionTypeEnum.LARGE);
  }

  /**
   * Tạo loại phiên bản CUSTOM.
   *
   * @returns RenditionType với giá trị CUSTOM
   */
  public static custom(): RenditionType {
    return new RenditionType(RenditionTypeEnum.CUSTOM);
  }

  /**
   * Tạo RenditionType từ giá trị string.
   *
   * @param value - Giá trị string của loại phiên bản
   * @returns RenditionType tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): RenditionType {
    switch (value) {
      case RenditionTypeEnum.THUMBNAIL:
        return this.thumbnail();
      case RenditionTypeEnum.SMALL:
        return this.small();
      case RenditionTypeEnum.MEDIUM:
        return this.medium();
      case RenditionTypeEnum.LARGE:
        return this.large();
      case RenditionTypeEnum.CUSTOM:
        return this.custom();
      default:
        throw new Error(`Giá trị loại phiên bản không hợp lệ: ${value}`);
    }
  }

  /**
   * So sánh hai RenditionType.
   *
   * @param other - RenditionType khác để so sánh
   * @returns true nếu hai RenditionType có cùng giá trị
   */
  public equals(other: RenditionType): boolean {
    return this._value === other.value;
  }

  /**
   * Chuyển đổi RenditionType thành chuỗi.
   *
   * @returns Chuỗi đại diện cho RenditionType
   */
  public toString(): string {
    return this._value;
  }
}
