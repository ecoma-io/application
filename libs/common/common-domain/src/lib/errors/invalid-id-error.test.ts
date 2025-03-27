/**
 * @fileoverview Unit test cho InvalidIdError
 * @since 1.0.0
 */

import { InvalidIdError } from "./invalid-id-error";
import { DomainError } from "./domain-error";

describe("InvalidIdError", () => {
  describe("constructor", () => {
    it("nên khởi tạo với ID không hợp lệ", () => {
      // Arrange & Act
      const invalidId = "invalid-id-123";
      const error = new InvalidIdError(invalidId);
      
      // Assert
      expect(error).toBeInstanceOf(InvalidIdError);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(invalidId);
      expect(error.name).toBe("InvalidIdError");
      expect(error.details).toBeUndefined();
    });
    
    it("nên duy trì prototype chain đúng cách", () => {
      // Arrange & Act
      const error = new InvalidIdError("123");
      
      // Assert
      expect(error instanceof InvalidIdError).toBe(true);
      expect(error instanceof DomainError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
    
    it("nên khởi tạo với thông điệp tùy chỉnh", () => {
      // Arrange & Act
      const customMessage = "ID không hợp lệ";
      const error = new InvalidIdError(customMessage, { id: "test-123" });
      
      // Assert
      expect(error.message).toBe(customMessage);
      expect(error.interpolationParams).toEqual({ id: "test-123" });
    });
  });
  
  describe("error handling", () => {
    it("nên có thể được bắt như một DomainError", () => {
      // Arrange
      const validateId = (id: string): string => {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(id)) {
          throw new InvalidIdError(`ID không hợp lệ: ${id}`);
        }
        return id;
      };
      
      // Act & Assert
      const invalidId = "not-a-valid-uuid";
      expect(() => validateId(invalidId)).toThrow(InvalidIdError);
      expect(() => validateId(invalidId)).toThrow(DomainError);
      expect(() => validateId(invalidId)).toThrow(`ID không hợp lệ: ${invalidId}`);
      
      // Kiểm tra với try-catch
      try {
        validateId(invalidId);
        fail("Nên ném ra lỗi");
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidIdError);
        expect((error as InvalidIdError).message).toBe(`ID không hợp lệ: ${invalidId}`);
      }
    });
    
    it("nên cho phép ID hợp lệ đi qua", () => {
      // Arrange
      const validateId = (id: string): string => {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(id)) {
          throw new InvalidIdError(`ID không hợp lệ: ${id}`);
        }
        return id;
      };
      
      // Act & Assert
      const validId = "123e4567-e89b-12d3-a456-426614174000";
      expect(validateId(validId)).toBe(validId);
    });
  });
}); 