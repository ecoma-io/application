import { AggregateRoot } from '../interfaces/aggregate-root.interface';
import { DomainEvent } from '../domain-events/domain-event.abstract';

/**
 * Lớp cơ sở trừu tượng cho tất cả các Aggregate Root trong DAM Bounded Context.
 */
export abstract class AbstractAggregateRoot implements AggregateRoot {
  /**
   * ID duy nhất của Aggregate Root.
   */
  abstract readonly id: string;

  /**
   * Danh sách các domain events chưa được xử lý.
   */
  private _events: DomainEvent[] = [];

  /**
   * Thêm một domain event vào danh sách events chưa được xử lý.
   *
   * @param event - Domain event cần thêm
   */
  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  /**
   * Lấy danh sách các domain events chưa được xử lý.
   *
   * @returns Mảng các domain events
   */
  getUncommittedEvents(): DomainEvent[] {
    return [...this._events];
  }

  /**
   * Đánh dấu tất cả các events là đã được xử lý.
   */
  clearEvents(): void {
    this._events = [];
  }
}
