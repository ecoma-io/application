/**
 * @fileoverview Unit test cho InvalidEmailError
 * @since 1.0.0
 */

import { InvalidEmailError } from "./invalid-email-error";
import { DomainError } from "./domain-error";

describe("InvalidEmailError", () => {
  describe("constructor", () => {
    it("nên khởi tạo với email không hợp lệ", () => {
      // Arrange & Act
      const invalidEmail = "invalid-email";
      const error = new InvalidEmailError(invalidEmail);
      
      // Assert
      expect(error).toBeInstanceOf(InvalidEmailError);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(invalidEmail);
      expect(error.name).toBe("InvalidEmailError");
      expect(error.details).toBeUndefined();
    });
    
    it("nên duy trì prototype chain đúng cách", () => {
      // Arrange & Act
      const error = new InvalidEmailError("test@example");
      
      // Assert
      expect(error instanceof InvalidEmailError).toBe(true);
      expect(error instanceof DomainError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
    
    it("nên khởi tạo với thông điệp tùy chỉnh", () => {
      // Arrange & Act
      const customMessage = "Email không hợp lệ";
      const error = new InvalidEmailError(customMessage, { email: "test@example" });
      
      // Assert
      expect(error.message).toBe(customMessage);
      expect(error.interpolationParams).toEqual({ email: "test@example" });
    });
  });
  
  describe("error handling", () => {
    it("nên có thể được bắt như một DomainError", () => {
      // Arrange
      const createEmail = (email: string) => {
        if (!email.includes("@") || !email.includes(".")) {
          throw new InvalidEmailError(`Email không hợp lệ: ${email}`);
        }
        return email;
      };
      
      // Act & Assert
      expect(() => createEmail("invalid")).toThrow(InvalidEmailError);
      expect(() => createEmail("invalid")).toThrow(DomainError);
      expect(() => createEmail("invalid")).toThrow(`Email không hợp lệ: invalid`);
      
      // Kiểm tra với try-catch
      try {
        createEmail("invalid");
        fail("Nên ném ra lỗi");
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidEmailError);
        expect((error as InvalidEmailError).message).toBe(`Email không hợp lệ: invalid`);
      }
    });
  });
}); 