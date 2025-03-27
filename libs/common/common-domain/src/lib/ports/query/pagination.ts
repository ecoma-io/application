/**
 * @fileoverview Interface định nghĩa phân trang
 * @since 1.0.0
 */

/**
 * Interface định nghĩa phân trang theo offset
 */
export interface IOffsetPagination {
  /**
   * Vị trí bắt đầu
   */
  offset: number;

  /**
   * Số lượng bản ghi tối đa
   */
  limit: number;
}

/**
 * Interface định nghĩa phân trang theo cursor tiến
 */
export interface ICursorAheadPagination {
  /**
   * Cursor bắt đầu
   */
  cursor: string;

  /**
   * Số lượng bản ghi tối đa
   */
  limit: number;
}

/**
 * Interface định nghĩa phân trang theo cursor lùi
 */
export interface ICursorBackPagination {
  /**
   * Cursor kết thúc
   */
  cursor: string;

  /**
   * Số lượng bản ghi tối đa
   */
  limit: number;
}

/**
 * Interface định nghĩa kết quả phân trang theo offset
 */
export interface IOffsetBasedPaginatedResult<T> {
  /**
   * Danh sách bản ghi
   */
  items: T[];

  /**
   * Tổng số bản ghi
   */
  total: number;

  /**
   * Vị trí bắt đầu
   */
  offset: number;

  /**
   * Số lượng bản ghi tối đa
   */
  limit: number;
}

/**
 * Interface định nghĩa kết quả phân trang theo cursor
 */
export interface ICursorBasedPaginatedResult<T> {
  /**
   * Danh sách bản ghi
   */
  items: T[];

  /**
   * Cursor tiếp theo
   */
  nextCursor?: string;

  /**
   * Cursor trước đó
   */
  prevCursor?: string;

  /**
   * Số lượng bản ghi tối đa
   */
  limit: number;
}


