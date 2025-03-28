import { Awaitable } from "@ecoma/common-types";
import { ICommand } from "../commands";


export interface IApplicationService {
  /**
   * @description Gửi một lệnh để thực hiện một hành động.
   * @param command Lệnh cần thực hiện.
   * @returns Kết quả của lệnh.
   */
  execute<TCommand extends ICommand, TResult>(command: TCommand): Awaitable<TResult>;
}
