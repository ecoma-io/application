/**
 * @fileoverview Interface định nghĩa tiêu chí tìm kiếm
 * @since 1.0.0
 */

/**
 * Interface định nghĩa tiêu chí tìm kiếm
 * @template T - Kiểu dữ liệu của đối tượng cần tìm kiếm
 */
export interface IQuerySpecification<T> {
  /**
   * Lấy danh sách các điều kiện lọc
   * @returns {Array<{field: keyof T, operator: string, value: unknown}>} Danh sách điều kiện lọc
   */
  getFilters(): Array<{field: keyof T, operator: string, value: unknown}>;

  /**
   * Lấy danh sách các điều kiện sắp xếp
   * @returns {Array<{field: keyof T, direction: 'asc' | 'desc'}>} Danh sách điều kiện sắp xếp
   */
  getSorts(): Array<{field: keyof T, direction: 'asc' | 'desc'}>;

  /**
   * Lấy số lượng bản ghi tối đa
   * @returns {number} Số lượng bản ghi tối đa
   */
  getLimit(): number;

  /**
   * Lấy vị trí bắt đầu
   * @returns {number} Vị trí bắt đầu
   */
  getOffset(): number;
}
