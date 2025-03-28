import { ICommand } from '@nestjs/cqrs';

/**
 * Command đăng xuất người dùng.
 */
export class LogoutUserCommand implements ICommand {
  /**
   * Tạo command đăng xuất người dùng.
   * @param sessionId - ID phiên làm việc cần đăng xuất
   */
  constructor(
    public readonly sessionId: string
  ) {}
} 