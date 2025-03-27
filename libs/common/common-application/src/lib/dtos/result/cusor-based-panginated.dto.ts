import { GenericResult } from "./generic-result.dto";

/**
 * Định nghĩa kết quả phân trang theo offset
 */
export class CusorBasedPaginatedDTO<T> extends GenericResult<Array<T>> {
  /**
   * Tổng số lượng phần tử
   */
  total!: number;

  /**
   * Cursor tiếp theo
   */
  afterCursor?: string;

  /**
   * Cursor trước đó
   */
  beforeCusor?: string;
}
