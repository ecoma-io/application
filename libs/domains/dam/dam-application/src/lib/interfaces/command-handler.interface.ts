/**
 * Interface định nghĩa cấu trúc cho một Command Handler trong CQRS.
 *
 * @template TCommand - Kiểu Command
 * @template TResult - Kiểu kết quả trả về
 */
export interface ICommandHandler<TCommand, TResult> {
  /**
   * Xử lý một command.
   *
   * @param command - Command cần xử lý
   * @returns Promise với kết quả của việc xử lý command
   */
  execute(command: TCommand): Promise<TResult>;
}
