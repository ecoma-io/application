/**
 * @fileoverview Unit test cho AbstractId
 * @since 1.0.0
 */

import { AbstractId } from "./base-id";
import { InvalidIdError } from "../../errors/invalid-id-error";

// Implement a concrete class that extends AbstractId for testing
class TestId extends AbstractId {}

describe("AbstractId", () => {
  describe("constructor", () => {
    it("nên khởi tạo với ID hợp lệ", () => {
      // Arrange & Act
      const validId = "test-123";
      const id = new TestId(validId);
      
      // Assert
      expect(id).toBeInstanceOf(AbstractId);
      expect(id.value).toBe(validId);
    });
    
    it("nên báo lỗi khi ID rỗng", () => {
      // Arrange & Act & Assert
      expect(() => new TestId("")).toThrow(InvalidIdError);
      expect(() => new TestId("")).toThrow("ID value cannot be empty");
    });
  });
  
  describe("toString", () => {
    it("nên trả về đúng giá trị ID dưới dạng string", () => {
      // Arrange
      const validId = "test-123";
      const id = new TestId(validId);
      
      // Act & Assert
      expect(id.toString()).toBe(validId);
    });
  });
  
  describe("equality", () => {
    it("nên so sánh bằng với ID có giá trị giống nhau", () => {
      // Arrange
      const id1 = new TestId("test-123");
      const id2 = new TestId("test-123");
      
      // Act & Assert
      expect(id1.equals(id2)).toBe(true);
    });
    
    it("nên so sánh khác với ID có giá trị khác nhau", () => {
      // Arrange
      const id1 = new TestId("test-123");
      const id2 = new TestId("test-456");
      
      // Act & Assert
      expect(id1.equals(id2)).toBe(false);
    });
    
    it("nên so sánh khác với null/undefined", () => {
      // Arrange
      const id = new TestId("test-123");
      
      // Act & Assert
      expect(id.equals(null as any)).toBe(false);
      expect(id.equals(undefined as any)).toBe(false);
    });
  });
}); 