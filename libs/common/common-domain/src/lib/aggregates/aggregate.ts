import { AbstractEntity, IEntityProps } from "../entity";
import { IDomainEvent } from "../events/domain-event";
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
  TId extends AbstractId,
  TProps extends IEntityProps<TId>
> extends AbstractEntity<TId, TProps> {
  private domainEvents: IDomainEvent[] = [];

  /**
   * Tạo một instance mới của Aggregate Root.
   *
   * @param props - props của Aggregate Root
   */
  constructor(props: TProps) {
    super(props);
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
  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  /**
   * Thêm một mảng các Domain Event vào danh sách các sự kiện chưa được publish.
   * Method này chỉ nên được gọi từ bên trong Aggregate Root.
   *
   * @param domainEvents - Mảng các Domain Event cần thêm
   *
   * @example
   * ```typescript
   * protected addDomainEvents(domainEvents: IDomainEvent[]): void {
   *   this.domainEvents.push(...domainEvents);
   * }
   * ```
   */
  protected addDomainEvents(domainEvents: IDomainEvent[]): void {
    this.domainEvents.push(...domainEvents);
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
  public getDomainEvents(): IDomainEvent[] {
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
