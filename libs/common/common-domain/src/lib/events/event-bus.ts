import { AbstractDomainEvent } from "./domain-event";

/**
 * Interface định nghĩa một Event Bus để phát các Domain Event
 *
 * Event Bus chịu trách nhiệm phát các Domain Event đến các subscriber quan tâm.
 * Các implementation cụ thể (như RabbitMQ, NATS) sẽ triển khai interface này.
 *
 * @since 1.0.0
 * @example
 * ```typescript
 * class RabbitMQEventBus implements IEventBus {
 *   async publish(events: AbstractDomainEvent[]): Promise<void> {
 *     // Phát event qua RabbitMQ
 *   }
 * }
 * ```
 */
export interface IEventBus {

   /**
   * Publish một domain event.
   *
   * @param event - Domain event cần publish
   * @returns Promise<void>
   * @throws Error nếu không thể publish event
   */
   publish(event: AbstractDomainEvent): Promise<void>;

    /**
   * Phát một mảng các Domain Event
   *
   * @param events - Mảng các Domain Event cần phát
   * @returns Promise void khi tất cả các event đã được phát thành công
   * @throws {Error} Nếu có lỗi khi phát event (ví dụ: mất kết nối message broker)
   * @example
   * ```typescript
   * const events = [new UserCreatedEvent(), new EmailSentEvent()];
   * await eventBus.publish(events);
   * ```
   */
  publishAll(events: AbstractDomainEvent[]): Promise<void>;

}
