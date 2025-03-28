/**
 * @fileoverview Unit test cho Initiator Value Object
 * @since 1.0.0
 */

import { Initiator } from './initiator';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('Initiator', () => {
  describe('create', () => {
    it('nên tạo initiator với các giá trị hợp lệ', () => {
      // Arrange
      const props = {
        type: 'User',
        id: 'user-123',
        name: 'John Doe'
      };

      // Act
      const initiator = Initiator.create(props);

      // Assert
      expect(initiator.type).toBe(props.type);
      expect(initiator.id).toBe(props.id);
      expect(initiator.name).toBe(props.name);
    });

    it('nên tạo initiator với id là null', () => {
      // Arrange
      const props = {
        type: 'System',
        id: null,
        name: 'System Task'
      };

      // Act
      const initiator = Initiator.create(props);

      // Assert
      expect(initiator.type).toBe(props.type);
      expect(initiator.id).toBeNull();
      expect(initiator.name).toBe(props.name);
    });

    it('nên throw lỗi khi thiếu type', () => {
      // Arrange
      const props = {
        id: 'user-123',
        name: 'John Doe'
      } as any;

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => Initiator.create(props),
        'Type is required'
      );
    });

    it('nên throw lỗi khi thiếu name', () => {
      // Arrange
      const props = {
        type: 'User',
        id: 'user-123'
      } as any;

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => Initiator.create(props),
        'Name is required'
      );
    });
  });
});
