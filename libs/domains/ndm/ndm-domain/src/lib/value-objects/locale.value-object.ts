import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho mã locale/ngôn ngữ.
 * Ví dụ: vi-VN, en-US
 */
export class Locale extends AbstractValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  /**
   * Tạo một đối tượng Locale mới
   * @param value Mã locale (ví dụ: vi-VN, en-US)
   * @returns Đối tượng Locale
   * @throws Error nếu giá trị không hợp lệ
   */
  public static create(value: string): Locale {
    const normalizedValue = value.trim();

    // Basic validation for locale format (e.g., vi-VN, en-US)
    const localeRegex = /^[a-z]{2}-[A-Z]{2}$/;
    if (!localeRegex.test(normalizedValue)) {
      throw new Error(`Invalid locale format: ${value}. Expected format: xx-XX (e.g., vi-VN, en-US)`);
    }

    return new Locale(normalizedValue);
  }

  /**
   * Lấy mã ngôn ngữ (phần đầu của locale)
   * @returns Mã ngôn ngữ (ví dụ: 'vi' từ 'vi-VN')
   */
  public getLanguageCode(): string {
    return this.props.value.split('-')[0];
  }

  /**
   * Lấy mã quốc gia (phần sau của locale)
   * @returns Mã quốc gia (ví dụ: 'VN' từ 'vi-VN')
   */
  public getCountryCode(): string {
    return this.props.value.split('-')[1];
  }

  /**
   * Chuyển đổi thành chuỗi
   * @returns Giá trị locale dưới dạng chuỗi
   */
  public override toString(): string {
    return this.props.value;
  }
}
