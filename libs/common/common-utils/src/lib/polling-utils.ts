/**
 * Hàm kiểm tra bất đồng bộ trả về T hoặc null.
 * @template T
 * @param {number} attempt - Số lần thử hiện tại
 * @returns {Promise<T | null>} Kết quả kiểm tra hoặc null nếu chưa đạt
 * @since 1.0.0
 */
export type PollUntilCheckFunction<T> = (attempt: number) => Promise<T | null>;

/**
 * Tuỳ chọn cho hàm pollUntil
 * @interface
 * @property {number} [maxRetries] - Số lần thử tối đa
 * @property {number} [delayMs] - Thời gian chờ giữa các lần thử (miliseconds)
 * @since 1.0.0
 */
export interface IPollUntilOptions {
  maxRetries?: number; // Số lần thử tối đa
  delayMs?: number; // Thời gian chờ giữa các lần thử (miliseconds)
}

/**
 * Lặp lại hàm kiểm tra bất đồng bộ cho đến khi có kết quả hoặc hết số lần thử.
 * @template T
 * @param {PollUntilCheckFunction<T>} checkFunction - Hàm kiểm tra trả về T hoặc null
 * @param {IPollUntilOptions} [options] - Tuỳ chọn số lần thử và thời gian chờ
 * @returns {Promise<T | undefined>} Kết quả tìm được hoặc undefined nếu không có
 * @example
 * await pollUntil(async (attempt) => attempt > 3 ? 'done' : null, { maxRetries: 5, delayMs: 100 });
 * @since 1.0.0
 */
export async function pollUntil<T>(
  checkFunction: PollUntilCheckFunction<T>, // Hàm kiểm tra tùy chỉnh
  options: IPollUntilOptions = {} // Đối tượng cấu hình tùy chọn
): Promise<T | undefined> {
  // Trả về T hoặc undefined
  const { maxRetries = 10, delayMs = 200 } = options; // Lấy giá trị từ options với giá trị mặc định

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await checkFunction(attempt);
    if (result) {
      return result; // Trả về kết quả khi tìm thấy
    }

    // Nếu chưa đạt maxRetries, đợi một thời gian rồi thử lại
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // Nếu không tìm thấy kết quả sau khi thử hết số lần tối đa, trả về undefined
  return undefined;
}
