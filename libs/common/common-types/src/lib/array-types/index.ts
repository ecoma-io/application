/**
 * @fileoverview Định nghĩa các type liên quan đến array
 * @since 1.0.0
 */

/**
 * Đại diện cho một giá trị có thể là một phần tử đơn lẻ hoặc một mảng các phần tử cùng kiểu.
 *
 * Hữu ích khi một hàm có thể chấp nhận cả một giá trị đơn lẻ hoặc một mảng giá trị.
 *
 * @template T - Kiểu dữ liệu của các phần tử.
 *
 * @example
 * ```typescript
 * // Định nghĩa hàm có thể xử lý một hoặc nhiều ID
 * function deleteItems(ids: ArrayOrSingle<string>): void {
 *   const idArray = Array.isArray(ids) ? ids : [ids];
 *   // Xử lý mảng ID
 *   idArray.forEach(id => console.log(`Xóa item ${id}`));
 * }
 *
 * // Sử dụng với một giá trị đơn
 * deleteItems('item-1');
 *
 * // Hoặc với một mảng giá trị
 * deleteItems(['item-1', 'item-2', 'item-3']);
 * ```
 */
export type ArrayOrSingle<T> = T | T[];

/**
 * Đại diện cho một mảng được đảm bảo có ít nhất một phần tử.
 *
 * Hữu ích khi bạn cần đảm bảo một mảng không rỗng trong các tham số hàm hoặc trả về giá trị.
 *
 * @template T - Kiểu dữ liệu của các phần tử trong mảng.
 *
 * @example
 * ```typescript
 * // Hàm yêu cầu ít nhất một phần tử trong mảng
 * function processItems(items: NonEmptyArray<string>): string {
 *   // Chúng ta có thể an toàn truy cập phần tử đầu tiên mà không cần kiểm tra mảng rỗng
 *   const firstItem = items[0];
 *   return `Đang xử lý ${items.length} items, bắt đầu với ${firstItem}`;
 * }
 *
 * // Hợp lệ
 * processItems(['item1', 'item2']);
 * processItems(['single-item']);
 *
 * // Không hợp lệ, sẽ gây lỗi TypeScript
 * // processItems([]);
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];
