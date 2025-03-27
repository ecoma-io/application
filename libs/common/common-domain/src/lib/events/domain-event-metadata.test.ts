/**
 * @fileoverview Unit test cho IDomainEventMetadata
 * @since 1.0.0
 */

import { IDomainEventMetadata } from "./domain-event-metadata";

describe("IDomainEventMetadata", () => {
  describe("interface properties", () => {
    it("nên cho phép khởi tạo với các thuộc tính tùy chọn", () => {
      // Arrange & Act
      const emptyMetadata: IDomainEventMetadata = {};
      const fullMetadata: IDomainEventMetadata = {
        correlationId: "correlation-123",
        causationId: "causation-456",
        userId: "user-789",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        language: "vi-VN",
        aggregateVersion: 1,
        sourceBoundedContext: "OrderManagement"
      };
      const partialMetadata: IDomainEventMetadata = {
        correlationId: "correlation-123",
        userId: "user-789"
      };

      // Assert
      expect(emptyMetadata).toBeDefined();
      expect(fullMetadata["correlationId"]).toBe("correlation-123");
      expect(fullMetadata["causationId"]).toBe("causation-456");
      expect(fullMetadata["userId"]).toBe("user-789");
      expect(fullMetadata["ipAddress"]).toBe("192.168.1.1");
      expect(fullMetadata["userAgent"]).toBe("Mozilla/5.0");
      expect(fullMetadata["language"]).toBe("vi-VN");
      expect(fullMetadata["aggregateVersion"]).toBe(1);
      expect(fullMetadata["sourceBoundedContext"]).toBe("OrderManagement");
      
      expect(partialMetadata["correlationId"]).toBe("correlation-123");
      expect(partialMetadata["userId"]).toBe("user-789");
      expect(partialMetadata["causationId"]).toBeUndefined();
    });
  });

  describe("usage patterns", () => {
    it("nên có thể được sử dụng với AbstractDomainEvent", () => {
      // Import AbstractDomainEvent để kiểm tra tính tương thích
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { AbstractDomainEvent } = require("./domain-event");
      
      // Arrange
      class TestEvent extends AbstractDomainEvent {
        constructor(metadata?: IDomainEventMetadata) {
          super(undefined, metadata);
        }
      }
      
      const metadata: IDomainEventMetadata = {
        correlationId: "correlation-123",
        userId: "user-789"
      };
      
      // Act
      const event = new TestEvent(metadata);
      
      // Assert
      expect(event["metadata"]).toEqual(metadata);
      expect(event["metadata"]["correlationId"]).toBe("correlation-123");
      expect(event["metadata"]["userId"]).toBe("user-789");
    });

    it("nên được đóng băng (freeze) khi được sử dụng trong AbstractDomainEvent", () => {
      // Import AbstractDomainEvent để kiểm tra tính tương thích
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { AbstractDomainEvent } = require("./domain-event");
      
      // Arrange
      class TestEvent extends AbstractDomainEvent {
        constructor(metadata?: IDomainEventMetadata) {
          super(undefined, metadata);
        }
      }
      
      const metadata: IDomainEventMetadata = {
        correlationId: "correlation-123"
      };
      
      // Act
      const event = new TestEvent(metadata);
      
      // Assert
      expect(() => {
        (event["metadata"] as any)["correlationId"] = "new-correlation";
      }).toThrow();
    });
  });
}); 