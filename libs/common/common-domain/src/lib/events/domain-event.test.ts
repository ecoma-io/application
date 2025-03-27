/**
 * @fileoverview Unit test cho AbstractDomainEvent
 * @since 1.0.0
 */

import { AbstractDomainEvent } from "./domain-event";
import { IDomainEventMetadata } from "./domain-event-metadata";
import { AssertionHelpers } from "@ecoma/common-testing";

class TestDomainEvent extends AbstractDomainEvent {
  constructor(timestamp?: Date, metadata?: IDomainEventMetadata, id?: string) {
    super(timestamp, metadata, id);
  }
}

describe("AbstractDomainEvent", () => {
  describe("constructor", () => {
    it("nên tạo event với giá trị mặc định", () => {
      // Act
      const event = new TestDomainEvent();

      // Assert
      expect(event.id).toBeDefined();
      AssertionHelpers.expectToBeInstanceOf(event.timestamp, Date);
      expect(event.metadata).toBeDefined();
    });

    it("nên tạo event với giá trị tùy chỉnh", () => {
      // Arrange
      const customId = "custom-id";
      const customTimestamp = new Date("2024-01-01");
      const customMetadata: IDomainEventMetadata = {
        userId: "user-123",
        correlationId: "corr-123",
      };

      // Act
      const event = new TestDomainEvent(
        customTimestamp,
        customMetadata,
        customId
      );

      // Assert
      expect(event.id).toBe(customId);
      expect(event.timestamp).toBe(customTimestamp);
      expect(event.metadata).toEqual(customMetadata);
    });
  });

  describe("metadata", () => {
    it("nên làm cho metadata không thể thay đổi", () => {
      // Arrange
      const metadata: IDomainEventMetadata = {
        userId: "user-123",
      };

      // Act
      const event = new TestDomainEvent(undefined, metadata);

      // Assert
      expect(() => {
        (event.metadata as any).userId = "new-user";
      }).toThrow();
    });
  });

  describe("id", () => {
    it("nên tạo id duy nhất cho các event khác nhau", () => {
      // Act
      const event1 = new TestDomainEvent();
      const event2 = new TestDomainEvent();

      // Assert
      expect(event1.id).not.toBe(event2.id);
    });
  });
});
