/**
 * @fileoverview Unit test cho AbstractAggregate
 * @since 1.0.0
 */

import { AbstractDomainEvent } from "../events";
import { UuidId } from "../value-object/id";
import { AbstractAggregate } from "./aggregate";
import { v4 as uuidv4 } from 'uuid';

class TestEvent extends AbstractDomainEvent {
  constructor() {
    super();
  }
}

class TestAggregate extends AbstractAggregate<UuidId> {
  constructor(id: UuidId) {
    super(id);
  }

  public addTestEvent(): void {
    this.addDomainEvent(new TestEvent());
  }

  // Helper method for testing
  public getId(): UuidId {
    return this.id;
  }
}

describe("AbstractAggregate", () => {
  describe("constructor", () => {
    it("nên tạo aggregate với id", () => {
      // Arrange
      const id = new UuidId(uuidv4());

      // Act
      const aggregate = new TestAggregate(id);

      // Assert
      expect(aggregate).toBeDefined();
      expect(aggregate.getId()).toBe(id);
    });
  });

  describe("domainEvents", () => {
    it("nên thêm và lấy domain events", () => {
      // Arrange
      const aggregate = new TestAggregate(new UuidId(uuidv4()));

      // Act
      aggregate.addTestEvent();
      const events = aggregate.getDomainEvents();

      // Assert
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TestEvent);
    });

    it("nên xóa tất cả domain events", () => {
      // Arrange
      const aggregate = new TestAggregate(new UuidId(uuidv4()));
      aggregate.addTestEvent();

      // Act
      aggregate.clearDomainEvents();

      // Assert
      expect(aggregate.getDomainEvents()).toHaveLength(0);
    });
  });

  describe("equals", () => {
    it("nên so sánh aggregate chính xác", () => {
      // Arrange
      const id = new UuidId(uuidv4());
      const aggregate1 = new TestAggregate(id);
      const aggregate2 = new TestAggregate(id);
      const aggregate3 = new TestAggregate(new UuidId(uuidv4()));

      // Act & Assert
      expect(aggregate1.equals(aggregate2)).toBe(true);
      expect(aggregate1.equals(aggregate3)).toBe(false);
    });

    it("nên xử lý null hoặc undefined trong equals", () => {
      // Arrange
      const aggregate = new TestAggregate(new UuidId(uuidv4()));

      // Act & Assert
      expect(aggregate.equals(null as any)).toBe(false);
      expect(aggregate.equals(undefined as any)).toBe(false);
    });
  });
});



