import { ICommand } from '@ecoma/common-application';

/**
 * Command yêu cầu đăng ký người dùng mới.
 */
export class RegisterUserCommand implements ICommand {
  /**
   * Version của command
   */
  public readonly version: string = '1.0.0';

  /**
   * Tạo một command đăng ký người dùng mới.
   * @param email - Email của người dùng
   * @param password - Mật khẩu của người dùng
   * @param firstName - Họ của người dùng
   * @param lastName - Tên của người dùng
   * @param locale - Mã locale/ngôn ngữ ưa thích của người dùng
   * @param requireEmailVerification - Có yêu cầu xác minh email hay không
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly locale = 'vi-VN',
    public readonly requireEmailVerification = true
  ) {}
}
