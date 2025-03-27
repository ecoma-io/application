/**
 * @fileoverview Interface định nghĩa repository đọc dữ liệu
 * @since 1.0.0
 */
import {
  AbstractAggregate,
  AbstractId,
  IEntityProps,
} from "@ecoma/common-domain";
import { CriteriaQueryDTO } from "../dtos/query";

/**
 * Interface định nghĩa repository đọc dữ liệu
 */
export interface IReadRepository<
  TId extends AbstractId,
  TProps extends IEntityProps<TId>,
  TAggregateRoot extends AbstractAggregate<TId, TProps>
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
   * @returns {Promise<{ items: TAggregateRoot[]; total: number; afterCursor?: string; beforeCursor?: string }>} Danh sách aggregate roots tìm được
   */
  find(
    specification: CriteriaQueryDTO
  ): Promise<{
    items: TAggregateRoot[];
    total: number;
    afterCursor?: string;
    beforeCursor?: string;
  }>;

  /**
   * Đếm số lượng aggregate roots theo tiêu chí
   * @param {IQuerySpecification<TAggregateRoot>} specification - Tiêu chí tìm kiếm
   * @returns {Promise<number>} Số lượng aggregate roots tìm được
   */
  count(specification: CriteriaQueryDTO): Promise<number>;

  /**
   * Kiểm tra sự tồn tại của aggregate root theo ID
   * @param {TId} id - ID của aggregate root
   * @returns {Promise<boolean>} true nếu aggregate root tồn tại, false nếu không tồn tại
   */
  exists(id: TId): Promise<boolean>;
}
