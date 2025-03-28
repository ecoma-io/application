import { ICommand } from '@nestjs/cqrs';

/**
 * Command đặt lại mật khẩu.
 */
export class ResetPasswordCommand implements ICommand {
  /**
   * Tạo command đặt lại mật khẩu.
   * @param token - Token đặt lại mật khẩu
   * @param newPassword - Mật khẩu mới
   */
  constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}
} 