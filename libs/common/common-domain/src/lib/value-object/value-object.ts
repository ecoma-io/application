import { deepEqual } from "@ecoma/common-utils";

/**
 * Lớp cơ sở trừu tượng cho tất cả các Value Object trong Domain Driven Design.
 *
 * Value Object là một đối tượng không có định danh, được xác định bởi giá trị của các thuộc tính.
 * Hai Value Object được coi là bằng nhau nếu chúng có cùng giá trị và cùng loại.
 *
 * @template T - Kiểu dữ liệu của các thuộc tính
 *
 * @example
 * ```typescript
 * class Money extends AbstractValueObject<{ amount: number; currency: string }> {
 *   constructor(amount: number, currency: string) {
 *     super({ amount, currency });
 *   }
 *
 *   public getAmount(): number {
 *     return this.props.amount;
 *   }
 *
 *   public getCurrency(): string {
 *     return this.props.currency;
 *   }
 * }
 *
 * const money1 = new Money(100, 'USD');
 * const money2 = new Money(100, 'USD');
 * console.log(money1.equals(money2)); // true
 * ```
 */
export abstract class AbstractValueObject<T extends object> {
  /**
   * Các thuộc tính của Value Object.
   * Được đánh dấu là readonly và frozen để đảm bảo tính bất biến.
   */
  protected readonly props: T;

  /**
   * Tạo một instance mới của Value Object.
   *
   * @param props - Các thuộc tính của Value Object
   *
   * @example
   * ```typescript
   * const money = new Money(100, 'USD');
   * ```
   */
  constructor(props: T) {
    // Đảm bảo props là bất biến
    // Sử dụng structuredClone nếu cần deep immutability cho các object/array lồng nhau
    // Tuy nhiên, Object.freeze là đủ cho mục đích cơ bản và hiệu quả hơn
    this.props = Object.freeze(props);
  }

  /**
   * So sánh hai Value Object dựa trên giá trị của các thuộc tính.
   * Hai Value Object được coi là bằng nhau nếu:
   * 1. Chúng là cùng một loại Value Object (cùng constructor)
   * 2. Tất cả các thuộc tính của chúng có cùng giá trị
   *
   * @param vo - Value Object khác để so sánh
   * @returns true nếu hai Value Object bằng nhau, ngược lại là false
   *
   * @example
   * ```typescript
   * const money1 = new Money(100, 'USD');
   * const money2 = new Money(100, 'USD');
   * const money3 = new Money(200, 'USD');
   *
   * console.log(money1.equals(money2)); // true
   * console.log(money1.equals(money3)); // false
   * ```
   */
  public equals(vo?: AbstractValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    // Kiểm tra nếu chúng là cùng một loại ValueObject
    if (this.constructor !== vo.constructor) {
      return false;
    }
    // Sử dụng hàm deepEqual tùy chỉnh để so sánh props
    return deepEqual(this.props, vo.props);
  }

  /**
   * Tạo một bản sao của Value Object.
   * Sử dụng structuredClone để tạo một bản sao sâu của các thuộc tính.
   *
   * @returns Một instance mới của Value Object với cùng các thuộc tính
   *
   * @example
   * ```typescript
   * const money = new Money(100, 'USD');
   * const moneyCopy = money.clone();
   * console.log(money.equals(moneyCopy)); // true
   * ```
   */
  public clone(): T {
    return structuredClone(this.props);
  }
}
