import { GenericResult } from "./generic-result.dto";

/**
 * Interface định nghĩa kết quả phân trang theo offset
 */
export class OffsetBasedPaginatedDTO<T> extends GenericResult<Array<T>> {
  /**
   * Tổng số bản ghi
   */
  total!: number;
}
