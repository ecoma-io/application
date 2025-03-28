import { Awaitable } from '@ecoma/common-types';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';

/**
 * Interface định nghĩa contract cho Command Bus
 * Command Bus chịu trách nhiệm gửi command đến command handler tương ứng
 */
export interface ICommandBus {
  /**
   * Đăng ký command handler cho một loại command cụ thể
   * @param commandType - Loại command cần đăng ký handler
   * @param handler - Command handler xử lý command
   * @throws {Error} Nếu đã có handler được đăng ký cho command này
   */
  register<TCommand extends ICommand, TResult = void>(
    commandType: new (...args: any[]) => TCommand,
    handler: ICommandHandler<TCommand, TResult>
  ): void;

  /**
   * Thực thi một command
   * @param command - Command cần thực thi
   * @returns Awaitable<TResult> chứa kết quả từ command handler
   * @throws {Error} Nếu không tìm thấy handler cho command
   */
  execute<TCommand extends ICommand, TResult = void>(command: TCommand): Awaitable<TResult>;
}
