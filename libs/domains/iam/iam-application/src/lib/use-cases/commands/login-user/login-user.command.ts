import { ICommand } from '@nestjs/cqrs';

/**
 * Command đăng nhập người dùng.
 */
export class LoginUserCommand implements ICommand {
  /**
   * Tạo command đăng nhập người dùng.
   * @param email - Email người dùng
   * @param password - Mật khẩu người dùng
   * @param organizationId - ID tổ chức (tùy chọn, nếu đăng nhập vào phạm vi tổ chức)
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly organizationId?: string
  ) {}
} 