import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AbstractDomainEvent } from '@ecoma/common-domain';
import { ILogger } from '@ecoma/common-application';
import { IEventPublisherPort } from '@ecoma/domains/bum/bum-application';

/**
 * Service triển khai IEventPublisherPort sử dụng RabbitMQ
 */
@Injectable()
export class RabbitMqEventPublisher implements IEventPublisherPort {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: ILogger
  ) {}

  /**
   * Publish domain event ra RabbitMQ
   * @param event Domain event cần publish
   */
  async publish(event: AbstractDomainEvent): Promise<void> {
    const eventType = event.constructor.name;
    const exchange = 'bum.events';
    const routingKey = this.getRoutingKeyFromEventType(eventType);

    this.logger.debug(`Publishing event to RabbitMQ: ${eventType}`, {
      eventType,
      exchange,
      routingKey
    });

    try {
      await this.amqpConnection.publish(exchange, routingKey, {
        id: event.id,
        type: eventType,
        timestamp: event.timestamp,
        data: this.serializeEventData(event)
      });

      this.logger.debug(`Event published successfully: ${eventType}`, {
        eventId: event.id
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Failed to publish event: ${eventType}`, {
        eventId: event.id,
        error: errorMessage,
        stack: errorStack
      });

      throw error;
    }
  }

  /**
   * Publish nhiều domain events ra RabbitMQ
   * @param events Danh sách các domain events cần publish
   */
  async publishAll(events: AbstractDomainEvent[]): Promise<void> {
    this.logger.debug(`Publishing ${events.length} events to RabbitMQ`);

    const publishPromises = events.map(event => this.publish(event));

    try {
      await Promise.all(publishPromises);
      this.logger.debug(`Successfully published all ${events.length} events`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Failed to publish some events`, {
        error: errorMessage,
        stack: errorStack
      });

      throw error;
    }
  }

  /**
   * Chuyển đổi từ loại event sang routing key
   * @param eventType Loại event
   */
  private getRoutingKeyFromEventType(eventType: string): string {
    // Convert from CamelCase to dot.notation
    // Example: SubscriptionActivatedEvent -> subscription.activated
    return eventType
      .replace(/Event$/, '') // Remove 'Event' suffix
      .replace(/([a-z])([A-Z])/g, '$1.$2') // Insert dots between words
      .toLowerCase();
  }

  /**
   * Chuyển đổi dữ liệu event sang JSON object
   * @param event Event cần serialized
   */
  private serializeEventData(event: AbstractDomainEvent): Record<string, unknown> {
    const eventObject = { ...event };

    // Remove non-data properties
    delete eventObject.id;
    delete eventObject.timestamp;

    // Convert any Value Objects to primitive values
    return this.convertValueObjectsToPrimitives(eventObject);
  }

  /**
   * Chuyển đổi các Value Objects sang giá trị nguyên thủy
   * @param obj Object cần chuyển đổi
   */
  private convertValueObjectsToPrimitives(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        result[key] = value;
      } else if (typeof value === 'object') {
        if ('value' in value && Object.keys(value).length === 1) {
          // Likely a simple Value Object with just a value property
          result[key] = (value as { value: unknown }).value;
        } else if (value instanceof Date) {
          // Handle Date objects
          result[key] = value.toISOString();
        } else if (Array.isArray(value)) {
          // Handle arrays
          result[key] = value.map(item =>
            typeof item === 'object' && item !== null ? this.convertValueObjectsToPrimitives(item as Record<string, unknown>) : item
          );
        } else {
          // Handle nested objects
          result[key] = this.convertValueObjectsToPrimitives(value as Record<string, unknown>);
        }
      } else {
        // Handle primitive values
        result[key] = value;
      }
    }

    return result;
  }
}
