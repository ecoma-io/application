import { Maybe, PlainObject, Primitive } from "@ecoma/common-types";

import { DomainError } from "./domain.error";

/**
 * Lỗi được ném ra khi một Value Object không hợp lệ.
 * Thường được sử dụng khi các điều kiện ràng buộc của Value Object không được thỏa mãn.
 *
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * throw new DomainValidationError("Email address is invalid", { email: "invalid-email" });
 * ```
 */
export class DomainValidationError extends DomainError {
  /**
   * Khởi tạo một DomainValidationError mới
   *
   * @param message - Thông điệp lỗi bằng tiếng Anh
   * @param interpolationParams - Các tham số để nội suy vào thông điệp lỗi
   */
  constructor(
    message: string,
    interpolationParams?: Record<string, Maybe<Primitive>>,
    details?: PlainObject
  ) {
    super(message, interpolationParams, details);
  }
}
