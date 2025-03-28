import { IDomainEventPublisher } from "@ecoma/alm-application";
import { AbstractDomainEvent as DomainEvent } from "@ecoma/common-domain";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RabbitMQDomainEventPublisher implements IDomainEventPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(event: DomainEvent): Promise<void> {
    const exchange = "alm.events";
    const routingKey = this.getRoutingKey(event);

    await this.amqpConnection.publish(exchange, routingKey, {
      id: event.id,
      type: event.constructor.name,
      timestamp: event.timestamp,
      metadata: event.metadata,
      data: this.serializeEventData(event),
    });
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }

  private getRoutingKey(event: DomainEvent): string {
    // Convert event class name to routing key
    // Example: AuditLogEntryPersistedEvent -> audit.log.entry.persisted
    const eventName = event.constructor.name
      .replace(/([A-Z])/g, ".$1")
      .toLowerCase()
      .replace(/^\./, "")
      .replace(/event$/, "");

    return eventName;
  }

  private serializeEventData(event: DomainEvent): Record<string, any> {
    // Remove internal properties and return only public data
    const { id, timestamp, metadata, ...data } = event;
    return data;
  }
}
