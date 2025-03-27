/**
 * @fileoverview Unit test cho IEventBus
 * @since 1.0.0
 */

import { AbstractDomainEvent } from "./domain-event";
import { IEventBus } from "./event-bus";

class TestEvent extends AbstractDomainEvent {
  constructor(public readonly data: string) {
    super();
  }
}

describe("IEventBus", () => {
  describe("interface implementation", () => {
    it("nên có thể triển khai publish các events", async () => {
      // Arrange
      const publishMock = jest.fn().mockResolvedValue(undefined);
      const publishAllMock = jest.fn().mockResolvedValue(undefined);
      const mockEventBus: IEventBus = {
        publish: publishMock,
        publishAll: publishAllMock
      };
      const events = [
        new TestEvent("event1"),
        new TestEvent("event2")
      ];
      // Act
      await mockEventBus.publishAll(events);
      // Assert
      expect(publishAllMock).toHaveBeenCalledTimes(1);
      expect(publishAllMock).toHaveBeenCalledWith(events);
    });
    it("nên xử lý các lỗi publish đúng cách", async () => {
      // Arrange
      const error = new Error("Publish failed");
      const publishMock = jest.fn().mockResolvedValue(undefined);
      const publishAllMock = jest.fn().mockRejectedValue(error);
      const mockEventBus: IEventBus = {
        publish: publishMock,
        publishAll: publishAllMock
      };
      const events = [new TestEvent("event1")];
      // Act & Assert
      await expect(mockEventBus.publishAll(events)).rejects.toThrow("Publish failed");
      expect(publishAllMock).toHaveBeenCalledWith(events);
    });
  });

  describe("implementation examples", () => {
    it("nên triển khai đúng với một message broker cụ thể", async () => {
      // Arrange
      class TestEventBus implements IEventBus {
        private broker: any;
        constructor(broker: any) {
          this.broker = broker;
        }
        async publish(event: AbstractDomainEvent): Promise<void> {
          await this.broker.send({
            eventName: event.constructor.name,
            payload: event,
            id: event.id,
            timestamp: event.timestamp
          });
        }
        async publishAll(events: AbstractDomainEvent[]): Promise<void> {
          for (const event of events) {
            await this.publish(event);
          }
        }
      }
      const mockBroker = {
        send: jest.fn().mockResolvedValue(undefined)
      };
      const eventBus = new TestEventBus(mockBroker);
      const event = new TestEvent("test-data");
      // Act
      await eventBus.publishAll([event]);
      // Assert
      expect(mockBroker.send).toHaveBeenCalledTimes(1);
      expect(mockBroker.send).toHaveBeenCalledWith({
        eventName: "TestEvent",
        payload: event,
        id: event.id,
        timestamp: event.timestamp
      });
    });
  });
}); 