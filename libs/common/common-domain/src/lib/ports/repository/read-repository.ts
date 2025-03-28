/**
 * @fileoverview Interface định nghĩa repository đọc dữ liệu
 * @since 1.0.0
 */

import { AbstractAggregate } from "../../aggregates";
import { AbstractId } from "../../value-object";
import {
  ICursorAheadPagination,
  ICursorBackPagination,
  ICursorBasedPaginatedResult,
  IOffsetBasedPaginatedResult,
  IOffsetPagination,
} from "../query/pagination";
import { IQuerySpecification } from "../query/query-specification";

/**
 * Interface định nghĩa repository đọc dữ liệu
 */
export interface IReadRepository<
  TId extends AbstractId,
  TAggregateRoot extends AbstractAggregate<TId>
> {
  /**
   * Tìm kiếm aggregate root theo ID
   * @param {TId} id - ID của aggregate root
   * @returns {Promise<TAggregateRoot | null>} Aggregate root tìm được hoặc null nếu không tìm thấy
   */
  findById(id: TId): Promise<TAggregateRoot | null>;

  /**
   * Tìm kiếm aggregate roots theo tiêu chí
   * @param {IQuerySpecification<TAggregateRoot>} specification - Tiêu chí tìm kiếm
   * @returns {Promise<TAggregateRoot[]>} Danh sách aggregate roots tìm được
   */
  find(
    specification: IQuerySpecification<TAggregateRoot>
  ): Promise<TAggregateRoot[]>;

  /**
   * Tìm kiếm aggregate roots theo tiêu chí với phân trang offset
   * @param {IQuerySpecification<TAggregateRoot>} specification - Tiêu chí tìm kiếm
   * @param {IOffsetPagination} pagination - Thông tin phân trang
   * @returns {Promise<IOffsetBasedPaginatedResult<TAggregateRoot>>} Kết quả phân trang
   */
  findWithOffsetPagination(
    specification: IQuerySpecification<TAggregateRoot>,
    pagination: IOffsetPagination
  ): Promise<IOffsetBasedPaginatedResult<TAggregateRoot>>;

  /**
   * Tìm kiếm aggregate roots theo tiêu chí với phân trang cursor
   * @param {IQuerySpecification<TAggregateRoot>} specification - Tiêu chí tìm kiếm
   * @param {ICursorAheadPagination | ICursorBackPagination} pagination - Thông tin phân trang
   * @returns {Promise<ICursorBasedPaginatedResult<TAggregateRoot>>} Kết quả phân trang
   */
  findWithCursorPagination(
    specification: IQuerySpecification<TAggregateRoot>,
    pagination: ICursorAheadPagination | ICursorBackPagination
  ): Promise<ICursorBasedPaginatedResult<TAggregateRoot>>;
}
