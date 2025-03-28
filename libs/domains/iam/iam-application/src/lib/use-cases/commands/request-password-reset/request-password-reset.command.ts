import { ICommand } from '@nestjs/cqrs';

/**
 * Command yêu cầu đặt lại mật khẩu.
 */
export class RequestPasswordResetCommand implements ICommand {
  /**
   * Tạo command yêu cầu đặt lại mật khẩu.
   * @param email - Email người dùng
   */
  constructor(
    public readonly email: string
  ) {}
} 