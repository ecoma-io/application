import { Maybe, Primitive } from "@ecoma/common-types";

import { DomainError } from "./domain-error";

/**
 * Lỗi được ném ra khi một Value Object không hợp lệ.
 * Thường được sử dụng khi các điều kiện ràng buộc của Value Object không được thỏa mãn.
 *
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * throw new InvalidValueObjectError("Email address is invalid", { email: "invalid-email" });
 * ```
 */
export class InvalidValueObjectError extends DomainError {
  /**
   * Khởi tạo một InvalidValueObjectError mới
   *
   * @param message - Thông điệp lỗi bằng tiếng Anh
   * @param interpolationParams - Các tham số để nội suy vào thông điệp lỗi
   */
  constructor(
    message: string,
    interpolationParams?: Record<string, Maybe<Primitive>>
  ) {
    super(message, interpolationParams);
  }
}
