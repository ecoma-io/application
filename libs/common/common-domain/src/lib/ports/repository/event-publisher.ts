import { AbstractDomainEvent } from "../../events/domain-event";

/**
 * Interface định nghĩa Event Publisher pattern trong Domain Driven Design.
 * Event Publisher chịu trách nhiệm publish các domain events đến các subscribers.
 *
 * @example
 * ```typescript
 * class OrderEventPublisher implements IEventPublisher {
 *   constructor(private readonly eventBus: EventBus) {}
 *
 *   async publish(event: AbstractDomainEvent): Promise<void> {
 *     await this.eventBus.publish(event);
 *   }
 *
 *   async publishAll(events: AbstractDomainEvent[]): Promise<void> {
 *     await Promise.all(events.map(event => this.publish(event)));
 *   }
 * }
 * ```
 */
export interface IEventPublisher {
  /**
   * Publish một domain event.
   *
   * @param event - Domain event cần publish
   * @returns Promise<void>
   * @throws Error nếu không thể publish event
   */
  publish(event: AbstractDomainEvent): Promise<void>;

  /**
   * Publish nhiều domain events.
   *
   * @param events - Mảng các domain events cần publish
   * @returns Promise<void>
   * @throws Error nếu không thể publish events
   */
  publishAll(events: AbstractDomainEvent[]): Promise<void>;
}
