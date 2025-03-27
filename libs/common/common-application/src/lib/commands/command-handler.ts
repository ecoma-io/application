import { Awaitable } from '@ecoma/common-types';
import { ICommand } from './command';
import { IGenericResult } from '../dtos';

/**
 * @interface ICommandHandler
 * @description Định nghĩa hợp đồng cho các lớp xử lý Command.
 * Mỗi Command Handler chịu trách nhiệm xử lý một loại Command cụ thể.
 * @template TCommand Loại Command mà Handler này xử lý (phải kế thừa ICommand).
 * @template TResult Loại kết quả trả về sau khi xử lý Command (có thể là void hoặc một DTO).
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void | IGenericResult<unknown> > {
  /**
   * @method handle
   * @description Phương thức xử lý Command.
   * @param command Instance của Command cần xử lý.
   * @returns Kết quả của quá trình xử lý (có thể là Promise).
   */
  handle(command: TCommand): Awaitable<TResult>;
}
