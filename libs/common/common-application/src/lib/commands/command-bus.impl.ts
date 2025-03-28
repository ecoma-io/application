/**
 * @fileoverview Implementation của CommandBus
 * @since 1.0.0
 */

import { Awaitable } from '@ecoma/common-types';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { ICommandBus } from './command-bus';

/**
 * Implementation của Command Bus
 * Chịu trách nhiệm quản lý và thực thi các command
 */
export class CommandBus implements ICommandBus {
  private handlers = new Map<new (...args: any[]) => ICommand, ICommandHandler<ICommand, any>>();

  /**
   * Đăng ký command handler cho một loại command cụ thể
   * @param commandType - Loại command cần đăng ký handler
   * @param handler - Command handler xử lý command
   * @throws {Error} Nếu đã có handler được đăng ký cho command này
   */
  register<TCommand extends ICommand, TResult = void>(
    commandType: new (...args: any[]) => TCommand,
    handler: ICommandHandler<TCommand, TResult>
  ): void {
    if (this.handlers.has(commandType)) {
      throw new Error(`Đã có handler được đăng ký cho command ${commandType.name}`);
    }
    this.handlers.set(commandType, handler as ICommandHandler<ICommand, any>);
  }

  /**
   * Thực thi một command
   * @param command - Command cần thực thi
   * @returns Awaitable<TResult> chứa kết quả từ command handler
   * @throws {Error} Nếu không tìm thấy handler cho command
   */
  async execute<TCommand extends ICommand, TResult = void>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.constructor as new (...args: any[]) => ICommand);
    if (!handler) {
      throw new Error(`Không tìm thấy handler cho command ${command.constructor.name}`);
    }
    return (handler as ICommandHandler<TCommand, TResult>).handle(command) as Promise<TResult>;
  }
}
