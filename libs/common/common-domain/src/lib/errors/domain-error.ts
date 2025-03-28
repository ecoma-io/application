import { Maybe, Primitive } from "@ecoma/common-types";

/**
 * Lớp cơ sở cho tất cả các lỗi domain trong hệ thống.
 * DomainError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi domain.
 *
 * @example
 * ```typescript
 * class OrderNotFoundError extends DomainError {
 *   constructor(orderId: string) {
 *     super('ORDER_NOT_FOUND', `Order with ID ${orderId} not found`);
 *   }
 * }
 *
 * class InvalidOrderStatusError extends DomainError {
 *   constructor(currentStatus: string, expectedStatus: string) {
 *     super(
 *       'INVALID_ORDER_STATUS',
 *       `Cannot change order status from ${currentStatus} to ${expectedStatus}`
 *     );
 *   }
 * }
 * ```
 */
export class DomainError<TDetails = unknown, TInterpolationParams extends Record<string, Maybe<Primitive>> = Record<string, Maybe<Primitive>>> extends Error {
  /**
   * Mã lỗi domain.
   */
  public readonly code: string;

  /** Tham số nội suy cho bản dịch */
  public readonly interpolationParams?: TInterpolationParams;

  /** Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao) */
  public readonly details?: TDetails;

  /**
   * Tạo một instance mới của DomainError.
   *
   * @param code - Mã lỗi domain
   * @param message - Thông điệp lỗi
   * @param interpolationParams - Tham số nội suy cho bản dịch
   * @param details - Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)
   */
  constructor(
    code: string,
    message: string,
    interpolationParams?: TInterpolationParams,
    details?: TDetails
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.interpolationParams = interpolationParams;
    this.details = details;

    // Fix lỗi prototype chain trong JS
    // Xem: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Kiểm tra xem một error có phải là DomainError hay không.
   *
   * @param error - Error cần kiểm tra
   * @returns true nếu error là DomainError, ngược lại là false
   */
  public static isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
  }
}
