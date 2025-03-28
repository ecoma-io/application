/**
 * @fileoverview Interface định nghĩa phương thức publish domain events
 * @since 1.0.0
 */

import { AbstractDomainEvent } from '@ecoma/common-domain';

/**
 * Interface định nghĩa phương thức publish domain events
 */
export interface IDomainEventPublisher {
  /**
   * Publish một domain event
   * @param {AbstractDomainEvent} event - Event cần publish
   * @returns {Promise<void>}
   */
  publish(event: AbstractDomainEvent): Promise<void>;

  /**
   * Publish nhiều domain events cùng lúc
   * @param events Danh sách domain events cần publish
   * @returns Promise<void>
   */
  publishAll(events: AbstractDomainEvent[]): Promise<void>;
}
