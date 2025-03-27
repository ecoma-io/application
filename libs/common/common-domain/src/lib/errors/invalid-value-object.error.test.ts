/**
 * @fileoverview Unit test cho InvalidValueObjectError
 * @since 1.0.0
 */

import { DomainError } from "./domain-error";
import { InvalidValueObjectError } from "./invalid-value-object.error";

describe("InvalidValueObjectError", () => {
  describe("constructor", () => {
    it("nên khởi tạo với vo không hợp lệ", () => {
      // Arrange & Act
      const invalidEmail = "invalid-vo";
      const error = new InvalidValueObjectError(invalidEmail);

      // Assert
      expect(error).toBeInstanceOf(InvalidValueObjectError);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(invalidEmail);
      expect(error.name).toBe("InvalidValueObjectError");
      expect(error.details).toBeUndefined();
    });

    it("nên duy trì prototype chain đúng cách", () => {
      // Arrange & Act
      const error = new InvalidValueObjectError("test@example");

      // Assert
      expect(error instanceof InvalidValueObjectError).toBe(true);
      expect(error instanceof DomainError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it("nên khởi tạo với thông điệp tùy chỉnh", () => {
      // Arrange & Act
      const customMessage = "Email không hợp lệ";
      const error = new InvalidValueObjectError(customMessage, {
        vo: "test@example",
      });

      // Assert
      expect(error.message).toBe(customMessage);
      expect(error.interpolationParams).toEqual({ vo: "test@example" });
    });
  });

  describe("error handling", () => {
    it("nên có thể được bắt như một DomainError", () => {
      // Arrange
      const createEmail = (vo: string) => {
        if (!vo.includes("@") || !vo.includes(".")) {
          throw new InvalidValueObjectError(`Email không hợp lệ: ${vo}`);
        }
        return vo;
      };

      // Act & Assert
      expect(() => createEmail("invalid")).toThrow(InvalidValueObjectError);
      expect(() => createEmail("invalid")).toThrow(DomainError);
      expect(() => createEmail("invalid")).toThrow(
        `Email không hợp lệ: invalid`
      );

      // Kiểm tra với try-catch
      try {
        createEmail("invalid");
        fail("Nên ném ra lỗi");
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidValueObjectError);
        expect((error as InvalidValueObjectError).message).toBe(
          `Email không hợp lệ: invalid`
        );
      }
    });
  });
});
