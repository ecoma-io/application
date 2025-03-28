/**
 * Interface định nghĩa cấu trúc cho một Query Handler trong CQRS.
 *
 * @template TQuery - Kiểu Query
 * @template TResult - Kiểu kết quả trả về
 */
export interface IQueryHandler<TQuery, TResult> {
  /**
   * Xử lý một query.
   *
   * @param query - Query cần xử lý
   * @returns Promise với kết quả của việc xử lý query
   */
  execute(query: TQuery): Promise<TResult>;
}
