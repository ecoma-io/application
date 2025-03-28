import { ICommand } from '@nestjs/cqrs';

/**
 * Command xác minh email người dùng.
 */
export class VerifyEmailCommand implements ICommand {
  /**
   * Tạo command xác minh email.
   * @param token - Token xác minh email
   */
  constructor(
    public readonly token: string
  ) {}
} 