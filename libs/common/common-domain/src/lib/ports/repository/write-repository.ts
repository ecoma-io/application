/**
 * @fileoverview Interface định nghĩa repository ghi dữ liệu
 * @since 1.0.0
 */

import { AbstractAggregate } from "../../aggregates";
import { IEntityProps } from "../../entity";
import { AbstractId } from "../../value-object";

/**
 * Interface định nghĩa repository ghi dữ liệu
 */
export interface IWriteRepository<
  TId extends AbstractId,
  TProps extends IEntityProps<TId>,
  TAggregateRoot extends AbstractAggregate<TId, TProps>
> {
  /**
   * Lưu một aggregate root
   * @param {TAggregateRoot} aggregateRoot - Aggregate root cần lưu
   * @returns {Promise<void>}
   */
  save(aggregateRoot: TAggregateRoot): Promise<void>;

  /**
   * Xóa một aggregate root theo ID
   * @param {TId} id - ID của aggregate root cần xóa
   * @returns {Promise<void>}
   */
  delete(id: TId): Promise<void>;

  /**
   * Xóa nhiều aggregate roots theo danh sách ID
   * @param {TId[]} ids - Danh sách ID của các aggregate roots cần xóa
   * @returns {Promise<void>}
   */
  deleteMany(ids: TId[]): Promise<void>;
}
