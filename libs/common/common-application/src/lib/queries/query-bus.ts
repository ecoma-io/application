import { Awaitable } from '../types';

/**
 * Interface cho một query
 */
export interface IQuery {
  readonly type: string;
}

/**
 * Interface cho một query handler
 */
export interface IQueryHandler<TQuery extends IQuery, TResult = void> {
  handle(query: TQuery): Awaitable<TResult>;
}

/**
 * Interface cho query bus
 */
export interface IQueryBus {
  /**
   * @method register
   * @description Đăng ký query handler cho một loại query cụ thể
   * @param queryType - Loại query cần đăng ký handler
   * @param handler - Query handler xử lý query
   * @throws {Error} Nếu đã có handler được đăng ký cho query này
   */
  register<TQuery extends IQuery, TResult = void>(
    queryType: new (...args: any[]) => TQuery,
    handler: IQueryHandler<TQuery, TResult>
  ): void;

  /**
   * @method execute
   * @description Gửi một Query để được xử lý bởi Query Handler phù hợp.
   * @param query Instance của Query cần thực thi.
   * @returns {Awaitable<TResult>} chứa kết quả (thường là DTO) từ Query Handler.
   * @throws {Error} Nếu không tìm thấy handler cho query
   */
  execute<TQuery extends IQuery, TResult = void>(query: TQuery): Awaitable<TResult>;
}
