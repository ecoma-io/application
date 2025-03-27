/**
 * @fileoverview Unit test cho AbstractValueObject
 * @since 1.0.0
 */

import { AbstractValueObject } from './value-object';
import { AssertionHelpers } from '@ecoma/common-testing';

interface ITestProps {
  value: string;
}

class TestValueObject extends AbstractValueObject<ITestProps> {
  constructor(props: ITestProps) {
    if (!props) {
      throw new Error('Props cannot be null or undefined');
    }
    if (props.value === null || props.value === undefined) {
      throw new Error('Value cannot be null or undefined');
    }
    if (typeof props.value !== 'string') {
      throw new Error('Value must be a string');
    }
    if (props.value.trim() === '') {
      throw new Error('Value cannot be empty');
    }
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  validate(): boolean {
    return true;
  }
}

describe('AbstractValueObject', () => {
  describe('constructor', () => {
    it('nên tạo value object với giá trị hợp lệ', () => {
      // Arrange
      const value = 'test';

      // Act
      const vo = new TestValueObject({ value });

      // Assert
      expect(vo.value).toBe(value);
    });

    it('nên throw lỗi khi value là null hoặc undefined', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject(null as any),
        'Props cannot be null or undefined'
      );
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject(undefined as any),
        'Props cannot be null or undefined'
      );
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: null as any }),
        'Value cannot be null or undefined'
      );
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: undefined as any }),
        'Value cannot be null or undefined'
      );
    });

    it('nên throw lỗi khi value là empty string', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: '' }),
        'Value cannot be empty'
      );
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: '   ' }),
        'Value cannot be empty'
      );
    });

    it('nên throw lỗi khi value không phải là string', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: 123 as any }),
        'Value must be a string'
      );
      AssertionHelpers.expectToThrowWithMessage(
        () => new TestValueObject({ value: {} as any }),
        'Value must be a string'
      );
    });
  });

  describe('equals', () => {
    it('nên so sánh value object chính xác', () => {
      // Arrange
      const vo1 = new TestValueObject({ value: 'test' });
      const vo2 = new TestValueObject({ value: 'test' });
      const vo3 = new TestValueObject({ value: 'other' });

      // Act & Assert
      expect(vo1.equals(vo2)).toBe(true);
      expect(vo1.equals(vo3)).toBe(false);
    });

    it('nên xử lý null hoặc undefined trong equals', () => {
      // Arrange
      const vo = new TestValueObject({ value: 'test' });

      // Act & Assert
      expect(vo.equals(null as any)).toBe(false);
      expect(vo.equals(undefined as any)).toBe(false);
    });
  });

  describe('toString', () => {
    it('nên chuyển đổi sang chuỗi', () => {
      // Arrange
      const value = 'test';
      const vo = new TestValueObject({ value });

      // Act & Assert
      expect(vo.toString()).toBe('[object Object]');
    });
  });

  describe('clone', () => {
    it('nên clone value object', () => {
      // Arrange
      const vo = new TestValueObject({ value: 'test' });

      // Act
      const clone = vo.clone();

      // Assert
      expect(clone).toEqual({ value: 'test' });
    });
  });

  describe('validate', () => {
    it('nên validate value object', () => {
      // Arrange
      const vo = new TestValueObject({ value: 'test' });

      // Act & Assert
      expect(vo.validate()).toBe(true);
    });
  });
});
