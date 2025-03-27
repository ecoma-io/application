/**
 * @fileoverview Unit test cho IEventPublisher
 * @since 1.0.0
 */

import { IEventPublisher } from "./event-publisher";
import { AbstractDomainEvent } from "../../events/domain-event";
import { AbstractAggregate } from "../../aggregates/aggregate";
import { AbstractId } from "../../value-object/id/base-id";

// Test implementation classes
class TestEvent extends AbstractDomainEvent {
  constructor(public readonly data: string) {
    super();
  }
}

// Define a test ID class
class TestId extends AbstractId {
  static create(value = "test-id"): TestId {
    return new TestId(value);
  }
}

class TestAggregate extends AbstractAggregate<TestId> {
  private $name: string;
  
  constructor(id: TestId, name: string) {
    super(id);
    this.$name = name;
  }
  
  changeName(newName: string): void {
    if (this.$name !== newName) {
      this.$name = newName;
      this.addDomainEvent(new TestEvent(`Name changed to ${newName}`));
    }
  }
  
  get name(): string {
    return this.$name;
  }
}

describe("IEventPublisher", () => {
  describe("interface", () => {
    it("nên có thể triển khai interface", () => {
      // Arrange
      class TestEventPublisher implements IEventPublisher {
        private publishedEvents: AbstractDomainEvent[] = [];
        
        async publish(event: AbstractDomainEvent): Promise<void> {
          this.publishedEvents.push(event);
        }
        
        async publishAll(events: AbstractDomainEvent[]): Promise<void> {
          this.publishedEvents.push(...events);
        }
        
        // Helper cho testing
        get events(): AbstractDomainEvent[] {
          return [...this.publishedEvents];
        }
      }
      
      // Act
      const publisher = new TestEventPublisher();
      
      // Assert
      expect(publisher).toBeDefined();
      expect(typeof publisher.publish).toBe("function");
      expect(typeof publisher.publishAll).toBe("function");
    });
  });
  
  describe("publish", () => {
    it("nên publish một event", async () => {
      // Arrange
      class TestEventPublisher implements IEventPublisher {
        private publishedEvents: AbstractDomainEvent[] = [];
        
        async publish(event: AbstractDomainEvent): Promise<void> {
          this.publishedEvents.push(event);
        }
        
        async publishAll(events: AbstractDomainEvent[]): Promise<void> {
          this.publishedEvents.push(...events);
        }
        
        // Helper cho testing
        get events(): AbstractDomainEvent[] {
          return [...this.publishedEvents];
        }
      }
      
      const publisher = new TestEventPublisher();
      const event = new TestEvent("test-data");
      
      // Act
      await publisher.publish(event);
      
      // Assert
      expect(publisher.events).toHaveLength(1);
      expect(publisher.events[0]).toBe(event);
    });
  });
  
  describe("publishAll", () => {
    it("nên publish nhiều events cùng lúc", async () => {
      // Arrange
      class TestEventPublisher implements IEventPublisher {
        private publishedEvents: AbstractDomainEvent[] = [];
        
        async publish(event: AbstractDomainEvent): Promise<void> {
          this.publishedEvents.push(event);
        }
        
        async publishAll(events: AbstractDomainEvent[]): Promise<void> {
          this.publishedEvents.push(...events);
        }
        
        // Helper cho testing
        get events(): AbstractDomainEvent[] {
          return [...this.publishedEvents];
        }
      }
      
      const publisher = new TestEventPublisher();
      const event1 = new TestEvent("event1");
      const event2 = new TestEvent("event2");
      
      // Act
      await publisher.publishAll([event1, event2]);
      
      // Assert
      expect(publisher.events).toHaveLength(2);
      expect(publisher.events[0]).toBe(event1);
      expect(publisher.events[1]).toBe(event2);
    });
    
    it("nên hoạt động với events từ Aggregate", async () => {
      // Arrange
      class TestEventPublisher implements IEventPublisher {
        private publishedEvents: AbstractDomainEvent[] = [];
        
        async publish(event: AbstractDomainEvent): Promise<void> {
          this.publishedEvents.push(event);
        }
        
        async publishAll(events: AbstractDomainEvent[]): Promise<void> {
          this.publishedEvents.push(...events);
        }
        
        // Helper cho testing
        get events(): AbstractDomainEvent[] {
          return [...this.publishedEvents];
        }
        
        // Helper function để publish các events từ aggregate
        async publishAggregateEvents(aggregate: AbstractAggregate<AbstractId>): Promise<void> {
          const events = aggregate.getDomainEvents();
          await this.publishAll(events);
          aggregate.clearDomainEvents();
        }
      }
      
      const publisher = new TestEventPublisher();
      const aggregate = new TestAggregate(TestId.create("agg-1"), "Original Name");
      
      // Act
      aggregate.changeName("New Name");
      await publisher.publishAggregateEvents(aggregate);
      
      // Assert
      expect(publisher.events).toHaveLength(1);
      expect(publisher.events[0]).toBeInstanceOf(TestEvent);
      expect((publisher.events[0] as TestEvent).data).toBe("Name changed to New Name");
      expect(aggregate.getDomainEvents()).toHaveLength(0);
    });
  });
}); 