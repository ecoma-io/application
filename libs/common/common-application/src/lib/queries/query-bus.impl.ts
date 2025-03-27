import { IQuery, IQueryBus, IQueryHandler } from "./query-bus";

/**
 * Triển khai Query Bus để xử lý các queries
 * @since 1.0.0
 */
export class QueryBusImpl implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

  /**
   * Đăng ký một query handler
   * @param {new (...args: any[]) => IQuery} queryType - Constructor của query
   * @param {IQueryHandler<IQuery, unknown>} handler - Handler xử lý query
   * @throws {Error} Nếu đã có handler được đăng ký cho query
   */
  public register(
    queryType: new (...args: any[]) => IQuery,
    handler: IQueryHandler<IQuery, unknown>
  ): void {
    const queryName = queryType.name;
    if (this.handlers.has(queryName)) {
      throw new Error(`Handler already registered for query ${queryType.name}`);
    }
    this.handlers.set(queryName, handler);
  }

  /**
   * Thực thi một query
   * @param {IQuery} query - Query cần thực thi
   * @returns {Promise<unknown>} Kết quả của query
   * @throws {Error} Nếu không tìm thấy handler cho query
   */
  public async execute<TQuery extends IQuery, TResult = void>(
    query: TQuery
  ): Promise<TResult> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for query ${query.constructor.name}`);
    }
    return handler.handle(query) as Promise<TResult>;
  }
}
