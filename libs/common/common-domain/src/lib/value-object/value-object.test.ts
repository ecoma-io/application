/**
 * @fileoverview Unit test cho AbstractValueObject
 * @since 1.0.0
 */

import { AbstractValueObject } from './value-object';
import { InvalidValueObjectError } from '../errors';

interface ITestProps {
  value: string;
}

class TestValueObject extends AbstractValueObject<ITestProps> {
  constructor(props: ITestProps) {
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

    it('nên throw InvalidValueObjectError khi props là null hoặc undefined hoặc không phải là object', () => {
      expect(() => new TestValueObject('' as any)).toThrow(InvalidValueObjectError);
      expect(() => new TestValueObject(null as any)).toThrow(InvalidValueObjectError);
      expect(() => new TestValueObject(undefined as any)).toThrow(InvalidValueObjectError);
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
