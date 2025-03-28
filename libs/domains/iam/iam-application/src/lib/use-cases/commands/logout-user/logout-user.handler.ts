import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutUserCommand } from './logout-user.command';
import { ISessionService } from '../../../interfaces';
import { SessionNotFoundError } from '../../../errors';

/**
 * Handler xử lý command đăng xuất.
 */
@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand, void> {
  /**
   * Constructor.
   * @param sessionService - Service quản lý phiên làm việc
   */
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService
  ) {}

  /**
   * Xử lý command đăng xuất.
   * @param command - Command đăng xuất
   */
  async execute(command: LogoutUserCommand): Promise<void> {
    try {
      await this.sessionService.terminateSession(command.sessionId);
    } catch {
      throw new SessionNotFoundError();
    }
  }
} 