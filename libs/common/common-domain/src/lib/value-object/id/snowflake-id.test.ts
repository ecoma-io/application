/**
 * @fileoverview Unit test cho SnowflakeId
 * @since 1.0.0
 */

import { SnowflakeId } from "./snowflake-id";
import { AbstractId } from "./base-id";
import { InvalidIdError } from "../../errors/invalid-id-error";

describe("SnowflakeId", () => {
  describe("constructor", () => {
    it("nên khởi tạo với ID snowflake hợp lệ", () => {
      // Arrange & Act
      const validId = "1234567890123456789"; // ID snowflake thường là một số lớn
      const id = new SnowflakeId(validId);
      
      // Assert
      expect(id).toBeInstanceOf(SnowflakeId);
      expect(id).toBeInstanceOf(AbstractId);
      expect(id.value).toBe(validId);
    });
    
    it("nên báo lỗi khi khởi tạo với ID không hợp lệ", () => {
      // Arrange & Act & Assert
      expect(() => new SnowflakeId("abc")).toThrow(InvalidIdError);
      expect(() => new SnowflakeId("123abc")).toThrow(InvalidIdError);
      expect(() => new SnowflakeId("")).toThrow(InvalidIdError);
    });
    
    it("nên chấp nhận ID snowflake lớn", () => {
      // Arrange & Act
      const bigId = "9223372036854775807"; // giá trị gần với Long.MAX_VALUE (2^63-1)
      const id = new SnowflakeId(bigId);
      
      // Assert
      expect(id.value).toBe(bigId);
    });
  });
  
  describe("validate", () => {
    it("nên chấp nhận chỉ ký tự số", () => {
      // Arrange, Act & Assert
      expect(() => new SnowflakeId("123456789")).not.toThrow();
      expect(() => new SnowflakeId("0")).not.toThrow();
    });
  });
  
  describe("equality", () => {
    it("nên so sánh bằng với SnowflakeId có giá trị giống nhau", () => {
      // Arrange
      const id1 = new SnowflakeId("1234567890");
      const id2 = new SnowflakeId("1234567890");
      
      // Act & Assert
      expect(id1.equals(id2)).toBe(true);
    });
    
    it("nên so sánh khác với SnowflakeId có giá trị khác nhau", () => {
      // Arrange
      const id1 = new SnowflakeId("1234567890");
      const id2 = new SnowflakeId("9876543210");
      
      // Act & Assert
      expect(id1.equals(id2)).toBe(false);
    });
    
    it("nên so sánh khác với ID loại khác", () => {
      // Arrange
      class OtherId extends AbstractId {
        constructor(id: string) {
          super(id);
        }
      }
      
      const snowflakeId = new SnowflakeId("1234567890");
      const otherId = new OtherId("1234567890");
      
      // Act & Assert
      expect(snowflakeId.equals(otherId)).toBe(false);
    });
  });
  
  describe("toString", () => {
    it("nên trả về đúng giá trị ID dưới dạng string", () => {
      // Arrange
      const validId = "1234567890";
      const id = new SnowflakeId(validId);
      
      // Act & Assert
      expect(id.toString()).toBe(validId);
    });
  });
}); 