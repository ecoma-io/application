/**
 * @fileoverview Unit test cho Email Value Object
 * @since 1.0.0
 */

import { Email } from './email';
import { InvalidEmailError } from '../errors';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('Email', () => {
  describe('constructor', () => {
    it('nên tạo email với địa chỉ hợp lệ', () => {
      // Arrange
      const validEmail = 'test@example.com';

      // Act
      const email = new Email(validEmail);

      // Assert
      expect(email.value).toBe(validEmail);
    });

    it('nên throw lỗi khi địa chỉ email không hợp lệ', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(() => new Email('invalid-email'), 'Invalid email format');
    });
  });

  describe('equals', () => {
    it('nên trả về true khi so sánh với cùng một địa chỉ email', () => {
      // Arrange
      const emailAddress = 'test@example.com';
      const email1 = new Email(emailAddress);
      const email2 = new Email(emailAddress);

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(true);
    });

    it('nên trả về false khi so sánh với địa chỉ email khác', () => {
      // Arrange
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
