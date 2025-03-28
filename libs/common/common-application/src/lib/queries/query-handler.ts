import { IQuery } from './query';
import { Awaitable } from '@ecoma/common-types';

/**
 * @interface IQueryHandler
 * @description Định nghĩa hợp đồng cho các lớp xử lý Query.
 * Mỗi Query Handler chịu trách nhiệm xử lý một loại Query cụ thể.
 * @template TQuery Loại Query mà Handler này xử lý (phải kế thừa IQuery).
 * @template TResult Loại kết quả trả về sau khi xử lý Query (thường là DTO hoặc mảng DTO).
 */
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  /**
   * @method handle
   * @description Phương thức xử lý Query.
   * @param query Instance của Query cần xử lý.
   * @returns Kết quả của quá trình xử lý (thường là Promise chứa DTO).
   */
  handle(query: TQuery): Awaitable<TResult>;
}