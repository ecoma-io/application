import { Maybe, Primitive } from "@ecoma/common-types";

/**
 * Lớp cơ sở cho tất cả các lỗi infrastructure trong hệ thống.
 * InfrastructureError cung cấp một cách chuẩn hóa để xử lý và phân loại các lỗi infrastructure.
 *
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * class DatabaseError extends InfrastructureError {
 *   constructor(orderId: string) {
 *     super(`Can't connect to replica {replicaId}`, {replicaId});
 *   }
 * }
 */
export class InfrastructureError<TDetails = unknown, TInterpolationParams extends Record<string, Maybe<Primitive>> = Record<string, Maybe<Primitive>>> extends Error {


  /** Tham số nội suy cho bản dịch */
  public readonly interpolationParams?: TInterpolationParams;

  /** Chi tiết lỗi (có thể dùng để log hoặc hiển thị nâng cao) */
  public readonly details?: TDetails;

  /**
   * Tạo một instance mới của InfrastructureError.
   *
   * @param message - Thông điệp lỗi
   * @param interpolationParams - Tham số nội suy cho bản dịch
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
