/**
 * @fileoverview Unit test cho AbstractEntity
 * @since 1.0.0
 */

import { AbstractEntity } from './entity';
import { UuidId } from '../value-object/id';

class TestEntity extends AbstractEntity<UuidId> {
  constructor(id: UuidId) {
    super(id);
  }
}

describe('AbstractEntity', () => {
  describe('constructor', () => {
    it('nên tạo entity với id', () => {
      // Arrange
      const id = UuidId.generate();

      // Act
      const entity = new TestEntity(id);

      // Assert
      expect(entity).toBeDefined();
    });
  });

  describe('equals', () => {
    it('nên so sánh entity chính xác', () => {
      // Arrange
      const id1 = UuidId.generate();
      const id2 = UuidId.generate();
      const entity1 = new TestEntity(id1);
      const entity2 = new TestEntity(id1);
      const entity3 = new TestEntity(id2);

      // Act & Assert
      expect(entity1.equals(entity2)).toBe(true);
      expect(entity1.equals(entity3)).toBe(false);
    });

    it('nên xử lý null hoặc undefined trong equals', () => {
      // Arrange
      const id = UuidId.generate();
      const entity = new TestEntity(id);

      // Act & Assert
      expect(entity.equals(null as any)).toBe(false);
      expect(entity.equals(undefined)).toBe(false);
    });

    it('nên không bằng với entity của loại khác', () => {
      // Arrange
      class OtherEntity extends AbstractEntity<UuidId> {
        constructor(id: UuidId) {
          super(id);
        }
      }

      const id = UuidId.generate();
      const entity1 = new TestEntity(id);
      const entity2 = new OtherEntity(id);

      // Act & Assert
      expect(entity1.equals(entity2)).toBe(false);
    });
  });
});
