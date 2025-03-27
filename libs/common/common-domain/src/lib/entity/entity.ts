import { AbstractId } from "../value-object";


export interface IEntityProps<TId extends AbstractId> {
  id: TId;
}

/**
 * Lớp cơ sở trừu tượng cho tất cả các Entity trong Domain Driven Design.
 *
 * Entity là một đối tượng có định danh duy nhất (ID) và vòng đời liên tục.
 * Hai Entity được coi là bằng nhau nếu chúng có cùng ID và cùng loại.
 *
 * @template TId - Kiểu dữ liệu của ID, phải kế thừa từ AbstractId
 *
 * @example
 * ```typescript
 * class Product extends AbstractEntity<UuidId> {
 *   constructor(id: UuidId) {
 *     super(id);
 *   }
 * }
 *
 * const product1 = new Product(new UuidId());
 * const product2 = new Product(new UuidId());
 * console.log(product1.equals(product2)); // false
 * ```
 */
export abstract class AbstractEntity<TId extends AbstractId, TProps extends IEntityProps<TId>> {
  protected props: TProps;



  /**
   * Tạo một instance mới của Entity.
   *
   * @param props props của Entity
   */
  constructor(props: TProps) {
    this.props = props;
  }

  /**
   * Lấy id của Entity
   * @returns {TId} id của entity
   */
  public get id(): TId {
    return this.props.id;
  }

  /**
   * So sánh hai Entity dựa trên ID và loại của chúng.
   * Hai Entity được coi là bằng nhau nếu:
   * 1. Chúng là cùng một loại Entity (cùng constructor)
   * 2. Chúng có cùng ID
   *
   * @param entity - Entity khác để so sánh
   * @returns true nếu hai Entity bằng nhau, ngược lại là false
   *
   * @example
   * ```typescript
   * const product1 = new Product(new UuidId());
   * const product2 = new Product(new UuidId());
   * const order = new Order(new UuidId());
   *
   * console.log(product1.equals(product2)); // false (khác ID)
   * console.log(product1.equals(order)); // false (khác loại)
   * ```
   */
  public equals(entity?: AbstractEntity<TId, TProps>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    // Kiểm tra nếu chúng là cùng một loại Entity
    if (this.constructor !== entity.constructor) {
      return false;
    }

    return this.props.id.equals(entity.props.id);
  }
}
