import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho mật khẩu.
 */
export class Password extends AbstractValueObject<{ value: string }> {
  /**
   * Tạo một đối tượng Password mới.
   * @param value - Giá trị mật khẩu
   * @throws Error khi mật khẩu không đủ an toàn
   */
  constructor(value: string) {
    super({ value });
    this.validate(value);
  }

  /**
   * Kiểm tra tính hợp lệ của mật khẩu.
   * @param password - Chuỗi mật khẩu cần kiểm tra
   * @throws Error khi mật khẩu không đáp ứng các quy tắc an toàn
   */
  private validate(password: string): void {
    // Kiểm tra độ dài
    if (password.length < 8) {
      throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
    }

    // Kiểm tra chữ in hoa
    if (!/[A-Z]/.test(password)) {
      throw new Error('Mật khẩu phải chứa ít nhất một chữ cái in hoa');
    }

    // Kiểm tra chữ thường
    if (!/[a-z]/.test(password)) {
      throw new Error('Mật khẩu phải chứa ít nhất một chữ cái thường');
    }

    // Kiểm tra chữ số
    if (!/[0-9]/.test(password)) {
      throw new Error('Mật khẩu phải chứa ít nhất một chữ số');
    }

    // Kiểm tra ký tự đặc biệt
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      throw new Error('Mật khẩu phải chứa ít nhất một ký tự đặc biệt');
    }
  }
}
