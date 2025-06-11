/**
 * Utility class cung cấp các phương thức kiểm tra điều kiện
 * @since 1.0.0
 */
export class Guard {
  /**
   * Kiểm tra giá trị không được null hoặc undefined
   * @param {unknown} argument - Giá trị cần kiểm tra
   * @param {string} argumentName - Tên của giá trị
   * @throws {Error} Nếu giá trị là null hoặc undefined
   */
  public static againstNullOrUndefined(argument: unknown, argumentName: string): void {
    if (argument === null || argument === undefined) {
      throw new Error(`${argumentName} cannot be null or undefined`);
    }
  }

  /**
   * Kiểm tra giá trị không được null, undefined hoặc rỗng
   * @param {unknown} argument - Giá trị cần kiểm tra
   * @param {string} argumentName - Tên của giá trị
   * @throws {Error} Nếu giá trị là null, undefined hoặc rỗng
   */
  public static againstNullOrEmpty(argument: unknown, argumentName: string): void {
    if (!argument) {
      throw new Error(`${argumentName} cannot be null or empty`);
    }
  }

  /**
   * Kiểm tra chuỗi không được rỗng
   * @param {string} argument - Chuỗi cần kiểm tra
   * @param {string} argumentName - Tên của chuỗi
   * @throws {Error} Nếu chuỗi rỗng
   */
  public static againstEmptyString(argument: string, argumentName: string): void {
    if (argument.trim().length === 0) {
      throw new Error(`${argumentName} cannot be empty string`);
    }
  }

  /**
   * Kiểm tra mảng không được rỗng
   * @param {unknown[]} argument - Mảng cần kiểm tra
   * @param {string} argumentName - Tên của mảng
   * @throws {Error} Nếu mảng rỗng
   */
  public static againstEmptyArray(argument: unknown[], argumentName: string): void {
    if (argument.length === 0) {
      throw new Error(`${argumentName} cannot be empty array`);
    }
  }

  /**
   * Kiểm tra giá trị không được nhỏ hơn hoặc bằng giới hạn
   * @param {number} argument - Giá trị cần kiểm tra
   * @param {number} limit - Giới hạn
   * @param {string} argumentName - Tên của giá trị
   * @throws {Error} Nếu giá trị nhỏ hơn hoặc bằng giới hạn
   */
  public static againstAtOrBelowLimit(argument: number, limit: number, argumentName: string): void {
    if (argument <= limit) {
      throw new Error(`${argumentName} must be greater than ${limit}`);
    }
  }

  /**
   * Kiểm tra giá trị không được lớn hơn hoặc bằng giới hạn
   * @param {number} argument - Giá trị cần kiểm tra
   * @param {number} limit - Giới hạn
   * @param {string} argumentName - Tên của giá trị
   * @throws {Error} Nếu giá trị lớn hơn hoặc bằng giới hạn
   */
  public static againstAtOrAboveLimit(argument: number, limit: number, argumentName: string): void {
    if (argument >= limit) {
      throw new Error(`${argumentName} must be less than ${limit}`);
    }
  }

  /**
   * Kiểm tra chuỗi phải là email hợp lệ
   * @param {string} argument - Chuỗi cần kiểm tra
   * @param {string} argumentName - Tên của chuỗi
   * @throws {Error} Nếu chuỗi không phải email hợp lệ
   */
  public static isValidEmail(argument: string, argumentName: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(argument)) {
      throw new Error(`${argumentName} must be a valid email address`);
    }
  }
}
