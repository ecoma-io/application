import { Awaitable } from '@ecoma/common-types';
import { IQuery } from './query';
import { IQueryHandler } from './query-handler';
import { IQueryBus } from './query-bus';

/**
 * Implementation của Query Bus
 * Chịu trách nhiệm quản lý và thực thi các query
 */
export class QueryBus implements IQueryBus {
  private handlers = new Map<new (...args: any[]) => IQuery, IQueryHandler<IQuery, any>>();

  /**
   * Đăng ký query handler cho một loại query cụ thể
   * @param queryType - Loại query cần đăng ký handler
   * @param handler - Query handler xử lý query
   * @throws {Error} Nếu đã có handler được đăng ký cho query này
   */
  register<TQuery extends IQuery, TResult = void>(
    queryType: new (...args: any[]) => TQuery,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    if (this.handlers.has(queryType)) {
      throw new Error(`Đã có handler được đăng ký cho query ${queryType.name}`);
    }
    this.handlers.set(queryType, handler as IQueryHandler<IQuery, any>);
  }

  /**
   * Thực thi một query
   * @param query - Query cần thực thi
   * @returns Awaitable<TResult> chứa kết quả từ query handler
   * @throws {Error} Nếu không tìm thấy handler cho query
   */
  async execute<TQuery extends IQuery, TResult = void>(query: TQuery): Promise<TResult> {
    const handler = this.handlers.get(query.constructor as new (...args: any[]) => IQuery);
    if (!handler) {
      throw new Error(`Không tìm thấy handler cho query ${query.constructor.name}`);
    }
    return (handler as IQueryHandler<TQuery, TResult>).handle(query) as Promise<TResult>;
  }
}
