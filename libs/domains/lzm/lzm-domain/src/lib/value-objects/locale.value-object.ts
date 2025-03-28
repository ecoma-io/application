/**
 * Đại diện cho một mã locale/ngôn ngữ được hỗ trợ trong hệ thống.
 * Value object này đảm bảo rằng mã locale nhập vào là hợp lệ.
 */
export class Locale {
  private readonly _value: string;

  /**
   * Khởi tạo một Locale mới.
   * @param value Giá trị locale (ví dụ: 'vi-VN', 'en-US')
   * @throws Error nếu giá trị locale không hợp lệ
   */
  constructor(value: string) {
    this.validateLocale(value);
    this._value = value;
  }

  /**
   * Lấy giá trị của locale.
   * @returns Giá trị locale dạng chuỗi
   */
  get value(): string {
    return this._value;
  }

  /**
   * So sánh xem locale này có bằng locale khác không.
   * @param other Locale khác cần so sánh
   * @returns true nếu hai locale giống nhau, false nếu không
   */
  equals(other: Locale): boolean {
    return this._value === other.value;
  }

  /**
   * Chuyển đổi locale thành chuỗi.
   * @returns Giá trị locale dạng chuỗi
   */
  toString(): string {
    return this._value;
  }

  /**
   * Kiểm tra xem chuỗi có phải là locale hợp lệ không.
   * @param value Chuỗi cần kiểm tra
   * @throws Error nếu giá trị locale không hợp lệ
   */
  private validateLocale(value: string): void {
    if (!value) {
      throw new Error('Giá trị locale không được để trống');
    }

    // Kiểm tra locale có đúng định dạng không (vd: xx-XX, x-XX, xx)
    const localeRegex = /^[a-z]{2,3}(-[A-Z]{2,3})?$/;
    if (!localeRegex.test(value)) {
      throw new Error(`Locale '${value}' không đúng định dạng. Định dạng hợp lệ: xx-XX, xx`);
    }
  }

  /**
   * Tạo một Locale từ chuỗi.
   * @param value Giá trị locale dạng chuỗi
   * @returns Đối tượng Locale mới
   */
  static fromString(value: string): Locale {
    return new Locale(value);
  }
}
