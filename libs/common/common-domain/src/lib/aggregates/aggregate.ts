import { AbstractEntity } from "../entity";
import { AbstractDomainEvent } from "../events/domain-event";
import { AbstractId } from "../value-object";

/**
 * Lớp trừu tượng cơ sở cho Aggregate Root trong Domain Driven Design.
 *
 * Aggregate Root là Entity chính trong một Consistency Boundary và quản lý Domain Events.
 * Nó đảm bảo tính nhất quán của dữ liệu trong một nhóm các Entity liên quan.
 *
 * @template TId - Kiểu dữ liệu của ID, phải kế thừa từ AbstractId
 *
 * @example
 * ```typescript
 * class Order extends AbstractAggregate<UuidId> {
 *   constructor(id: UuidId) {
 *     super(id);
 *   }
 *
 *   public placeOrder(): void {
 *     // Business logic
 *     this.addDomainEvent(new OrderPlacedEvent(this.id));
 *   }
 * }
 * ```
 */
export abstract class AbstractAggregate<
  TId extends AbstractId
> extends AbstractEntity<TId> {
  private domainEvents: AbstractDomainEvent[] = [];

  /**
   * Tạo một instance mới của Aggregate Root.
   *
   * @param id - ID của Aggregate Root
   */
  constructor(id: TId) {
    super(id);
  }

  /**
   * Thêm một Domain Event vào danh sách các sự kiện chưa được publish.
   * Method này chỉ nên được gọi từ bên trong Aggregate Root.
   *
   * @param domainEvent - Domain Event cần thêm
   *
   * @example
   * ```typescript
   * protected placeOrder(): void {
   *   // Business logic
   *   this.addDomainEvent(new OrderPlacedEvent(this.id));
   * }
   * ```
   */
  protected addDomainEvent(domainEvent: AbstractDomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  /**
   * Lấy danh sách các Domain Event chưa được publish.
   * Trả về một bản sao của mảng để tránh việc sửa đổi trực tiếp.
   *
   * @returns Mảng các Domain Event
   *
   * @example
   * ```typescript
   * const events = aggregateRoot.getDomainEvents();
   * for (const event of events) {
   *   await eventBus.publish(event);
   * }
   * ```
   */
  public getDomainEvents(): AbstractDomainEvent[] {
    return [...this.domainEvents]; // Trả về bản sao
  }

  /**
   * Xóa tất cả các Domain Event đã được publish.
   * Method này nên được gọi sau khi các event đã được xử lý thành công.
   *
   * @example
   * ```typescript
   * const events = aggregateRoot.getDomainEvents();
   * await eventBus.publish(events);
   * aggregateRoot.clearDomainEvents();
   * ```
   */
  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
