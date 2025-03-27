/**
 * Interface định nghĩa Unit of Work pattern trong Domain Driven Design.
 * Unit of Work đảm bảo tính nhất quán của dữ liệu bằng cách quản lý các transaction.
 *
 * @example
 * ```typescript
 * class OrderUnitOfWork implements IUnitOfWork {
 *   constructor(
 *     private readonly orderRepository: IWriteRepository<Order>,
 *     private readonly paymentRepository: IWriteRepository<Payment>
 *   ) {}
 *
 *   async execute<T>(work: () => Promise<T>): Promise<T> {
 *     try {
 *       const result = await work();
 *       await this.commit();
 *       return result;
 *     } catch (error) {
 *       await this.rollback();
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
export interface IUnitOfWork {
  /**
   * Thực thi một unit of work trong một transaction.
   * Nếu work function throw error, transaction sẽ được rollback.
   * Nếu work function thành công, transaction sẽ được commit.
   *
   * @param work - Function chứa các thao tác cần thực hiện trong transaction
   * @returns Promise chứa kết quả của work function
   * @throws Error nếu có lỗi xảy ra trong quá trình thực thi
   */
  execute<T>(work: () => Promise<T>): Promise<T>;

  /**
   * Commit transaction hiện tại.
   * Method này nên được gọi sau khi tất cả các thao tác đã thành công.
   *
   * @returns Promise<void>
   * @throws Error nếu không thể commit transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback transaction hiện tại.
   * Method này nên được gọi khi có lỗi xảy ra trong quá trình thực thi.
   *
   * @returns Promise<void>
   * @throws Error nếu không thể rollback transaction
   */
  rollback(): Promise<void>;
}
