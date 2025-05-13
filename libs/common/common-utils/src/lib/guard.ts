/**
 * Guard chứa các phương thức tiện ích để kiểm tra đối số.
 */
export class Guard {

  /**
   * Kiểm tra xem giá trị có null hoặc undefined không.
   * @param value - Giá trị cần kiểm tra
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu giá trị là null hoặc undefined
   */
  public static againstNullOrUndefined(value: unknown, argumentName: string): void {
    if (value === null || value === undefined) {
      throw new Error(`${argumentName} cannot be null or undefined`);
    }
  }

  /**
     * Kiểm tra xem giá trị có null hoặc rỗng không.
     * @param value - Giá trị cần kiểm tra
     * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
     * @throws Error nếu giá trị là null hoặc rỗng
     */
  static againstNullOrEmpty(email: string, argumentName: string) {
    if (email === null || email === '') {
      throw new Error(`${argumentName} cannot be null or empty`);
    }
  }

  /**
   * Kiểm tra xem chuỗi có rỗng không.
   * @param value - Chuỗi cần kiểm tra
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu chuỗi là rỗng
   */
  public static againstEmptyString(value: string, argumentName: string): void {
    if (!value) {
      throw new Error(`${argumentName} không được phép là chuỗi rỗng`);
    }
  }

  /**
   * Kiểm tra xem mảng có rỗng không.
   * @param value - Mảng cần kiểm tra
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu mảng là rỗng
   */
  public static againstEmptyArray(value: unknown[], argumentName: string): void {
    if (value.length === 0) {
      throw new Error(`${argumentName} không được phép là mảng rỗng`);
    }
  }

  /**
   * Kiểm tra xem số có nhỏ hơn hoặc bằng một giá trị cho trước không.
   * @param value - Số cần kiểm tra
   * @param limit - Giới hạn
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu số nhỏ hơn hoặc bằng giới hạn
   */
  public static againstAtOrBelowLimit(value: number, limit: number, argumentName: string): void {
    if (value <= limit) {
      throw new Error(`${argumentName} không được phép nhỏ hơn hoặc bằng ${limit}`);
    }
  }

  /**
   * Kiểm tra xem số có lớn hơn hoặc bằng một giá trị cho trước không.
   * @param value - Số cần kiểm tra
   * @param limit - Giới hạn
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu số lớn hơn hoặc bằng giới hạn
   */
  public static againstAtOrAboveLimit(value: number, limit: number, argumentName: string): void {
    if (value >= limit) {
      throw new Error(`${argumentName} không được phép lớn hơn hoặc bằng ${limit}`);
    }
  }

  /**
   * Kiểm tra xem một chuỗi có đúng định dạng email không.
   * @param value - Chuỗi cần kiểm tra
   * @param argumentName - Tên của đối số (để hiển thị trong thông báo lỗi)
   * @throws Error nếu chuỗi không phải là email hợp lệ
   */
  public static isValidEmail(value: string, argumentName: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`${argumentName} phải là một địa chỉ email hợp lệ`);
    }
  }
}
