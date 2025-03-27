import { Maybe, Primitive } from "@ecoma/common-types";

/**
 * Lớp cơ sở cho tất cả các lỗi domain trong hệ thống.
 * DomainError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi domain.
 *
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * class OrderNotFoundError extends DomainError {
 *   constructor(orderId: string) {
 *     super(`Order with ID {orderId} not found`, {orderId});
 *   }
 * }
 */
export class DomainError<
  TDetails = unknown,
  TInterpolationParams extends Record<string, Maybe<Primitive>> = Record<
    string,
    Maybe<Primitive>
  >
> extends Error {
  /** Tham số nội suy cho bản dịch */
  public readonly interpolationParams?: TInterpolationParams;

  /** Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao) */
  public readonly details?: TDetails;

  /**
   * Tạo một instance mới của DomainError.
   *
   * @param message - Thông điệp lỗi. Mặc định phải là tiếng anh
   * @param interpolationParams - Tham số nội suy cho bản dịch (có thể dùng để thay thế các placeholder trong message) hỗ trợ việc dịch message thành ngôn ngữ khác
   * @param details - Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao)
   */
  constructor(
    message: string,
    interpolationParams?: TInterpolationParams,
    details?: TDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    this.interpolationParams = interpolationParams;
    this.details = details;

    // Fix lỗi prototype chain trong JS
    // Xem: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
