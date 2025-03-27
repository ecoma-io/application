/**
 * @fileoverview Unit test cho DomainError
 * @since 1.0.0
 */

import { DomainError } from "./domain-error";

describe("DomainError", () => {
  describe("constructor", () => {
    it("nên khởi tạo với message cơ bản", () => {
      // Arrange & Act
      const error = new DomainError("Lỗi domain đơn giản");
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toBe("Lỗi domain đơn giản");
      expect(error.name).toBe("DomainError");
      expect(error.interpolationParams).toBeUndefined();
      expect(error.details).toBeUndefined();
      expect(error.stack).toBeDefined();
    });
    
    it("nên khởi tạo với parameters nội suy", () => {
      // Arrange & Act
      const params = { entityId: "123", entityType: "Order" };
      const error = new DomainError("Không tìm thấy {entityType} với ID {entityId}", params);
      
      // Assert
      expect(error.message).toBe("Không tìm thấy {entityType} với ID {entityId}");
      expect(error.interpolationParams).toEqual(params);
      expect(error.details).toBeUndefined();
    });
    
    it("nên khởi tạo với details bổ sung", () => {
      // Arrange & Act
      const params = { entityId: "123" };
      const details = { status: 404, code: "ENTITY_NOT_FOUND" };
      const error = new DomainError(
        "Không tìm thấy entity với ID {entityId}",
        params,
        details
      );
      
      // Assert
      expect(error.message).toBe("Không tìm thấy entity với ID {entityId}");
      expect(error.interpolationParams).toEqual(params);
      expect(error.details).toEqual(details);
    });
  });
  
  describe("inheritance", () => {
    it("nên cho phép kế thừa và duy trì prototype chain", () => {
      // Arrange
      class OrderNotFoundError extends DomainError<{ status: number }, { orderId: string }> {
        constructor(orderId: string) {
          super(
            "Không tìm thấy đơn hàng với ID {orderId}",
            { orderId },
            { status: 404 }
          );
        }
      }
      
      // Act
      const error = new OrderNotFoundError("order-123");
      
      // Assert
      expect(error).toBeInstanceOf(OrderNotFoundError);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("OrderNotFoundError");
      expect(error.message).toBe("Không tìm thấy đơn hàng với ID {orderId}");
      expect(error.interpolationParams).toEqual({ orderId: "order-123" });
      expect(error.details).toEqual({ status: 404 });
    });
    
    it("nên bảo toàn thông tin stack trace", () => {
      // Arrange & Act
      const error = new DomainError("Test error");
      
      // Assert
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("domain-error.test.ts");
    });
  });
  
  describe("immutability", () => {
    it("nên chia sẻ tham chiếu với các đối tượng gốc", () => {
      // Arrange
      const params = { entityId: "123" };
      const error = new DomainError("Test", params);
      
      // Act
      // Thay đổi đối tượng gốc và kiểm tra xem thay đổi có ảnh hưởng đến error không
      params.entityId = "456";
      
      // Assert - Kiểm tra tham chiếu được chia sẻ
      expect(error.interpolationParams?.entityId).toBe("456");
      
      // Kiểm tra cập nhật trực tiếp đối tượng interpolationParams
      (error.interpolationParams as any).entityId = "789";
      expect(params.entityId).toBe("789");
    });
  });
}); 