/**
 * @fileoverview Interface định nghĩa validator pattern trong Domain Driven Design
 * @since 1.0.0
 */

/**
 * Interface định nghĩa kết quả validation của validator
 */
export interface IValidatorResult {
  /**
   * Trạng thái validation
   */
  isValid: boolean;

  /**
   * Danh sách các lỗi validation
   */
  errors: IValidatorError[];
}

/**
 * Interface định nghĩa một lỗi validation của validator
 */
export interface IValidatorError {
  /**
   * Tên của field bị lỗi
   */
  field: string;

  /**
   * Mã lỗi
   */
  code: string;

  /**
   * Thông điệp lỗi
   */
  message: string;
}

/**
 * Interface định nghĩa Validator pattern trong Domain Driven Design.
 * Validator chịu trách nhiệm validate các đối tượng domain.
 *
 * @template T - Kiểu dữ liệu của đối tượng cần validate
 *
 * @example
 * ```typescript
 * class OrderValidator implements IValidator<Order> {
 *   validate(order: Order): IValidatorResult {
 *     const errors: IValidatorError[] = [];
 *
 *     if (!order.customerId) {
 *       errors.push({
 *         field: 'customerId',
 *         code: 'REQUIRED',
 *         message: 'Customer ID is required'
 *       });
 *     }
 *
 *     return {
 *       isValid: errors.length === 0,
 *       errors
 *     };
 *   }
 * }
 * ```
 */
export interface IValidator<T> {
  /**
   * Validate một đối tượng domain
   * @param {T} target - Đối tượng cần validate
   * @returns {IValidatorResult} Kết quả validation
   */
  validate(target: T): IValidatorResult;
}
