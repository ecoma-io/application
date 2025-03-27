/**
 * @fileoverview Publisher cho domain events
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { AbstractDomainEvent } from '@ecoma/common-domain';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

/**
 * Publisher cho domain events
 */
@Injectable()
export class DomainEventPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Publish một domain event
   * @param {AbstractDomainEvent} event - Event cần publish
   * @returns {Promise<void>}
   */
  async publish(event: AbstractDomainEvent): Promise<void> {
    await this.amqpConnection.publish(
      'domain.events',
      event.constructor.name,
      event
    );
  }

  /**
   * Publish nhiều domain events cùng lúc
   * @param {AbstractDomainEvent[]} events - Danh sách events cần publish
   * @returns {Promise<void>}
   */
  async publishAll(events: AbstractDomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }
}
