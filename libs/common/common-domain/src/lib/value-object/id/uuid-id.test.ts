/**
 * @fileoverview Unit test cho UuidId Value Object
 * @since 1.0.0
 */

import { UuidId } from './uuid-id';
import { InvalidIdError } from '../../errors';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('UuidId', () => {
  describe('constructor', () => {
    it('nên tạo instance với UUID hợp lệ', () => {
      // Arrange
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const id = new UuidId(validUuid);

      // Assert
      expect(id instanceof UuidId).toBe(true);
      expect(id.value).toBe(validUuid);
    });

    it('nên tạo instance với UUID hợp lệ khác cách viết', () => {
      // Arrange
      const validUuid = '123E4567-E89B-12D3-A456-426614174000';
      const expectedValue = validUuid; // UuidId không chuyển đổi sang chữ thường

      // Act
      const id = new UuidId(validUuid);

      // Assert
      expect(id.value).toBe(expectedValue);
    });

    it('nên throw lỗi khi UUID không hợp lệ', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(() => new UuidId('invalid-uuid'), /Invalid UUID format/);
      AssertionHelpers.expectToThrowWithMessage(() => new UuidId('123e4567-e89b-12d3-a456'), /Invalid UUID format/);

      // Kiểm tra lỗi cho trường hợp UUID rỗng
      try {
        new UuidId('');
        // Nếu không có lỗi, test sẽ fail
        expect(true).toBe(false); // Đảm bảo test fail nếu không có lỗi
      } catch (error) {
        if (error instanceof InvalidIdError) {
          expect(error.message).toContain('ID value cannot be empty');
        } else {
          throw error; // Nếu không phải InvalidIdError, rethrow để test fail
        }
      }
    });
  });



  describe('equals', () => {
    it('nên trả về true khi so sánh với cùng một UUID', () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id1 = new UuidId(uuid);
      const id2 = new UuidId(uuid);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('nên trả về false khi so sánh với UUID khác', () => {
      // Arrange
      const id1 = new UuidId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new UuidId('123e4567-e89b-12d3-a456-426614174001');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('nên chuyển đổi sang chuỗi', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const id = new UuidId(uuidString);

      // Act & Assert
      expect(id.toString()).toBe(uuidString);
    });
  });
});
