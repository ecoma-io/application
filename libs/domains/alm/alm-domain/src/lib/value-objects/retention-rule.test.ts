import { RetentionRule } from './retention-rule';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('RetentionRule', () => {
  describe('create', () => {
    it('nên throw lỗi khi retention duration value không dương', () => {
      // Arrange
      const props = {
        retentionDurationValue: 0,
        retentionDurationUnit: 'Day' as const
      };

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionRule.create(props),
        'Retention duration value must be greater than 0'
      );
    });

    it('nên throw lỗi khi retention duration unit không hợp lệ', () => {
      // Arrange
      const props = {
        retentionDurationValue: 30,
        retentionDurationUnit: 'Invalid' as any
      };

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionRule.create(props),
        'Invalid retention duration unit'
      );
    });

    it('nên tạo rule với các giá trị hợp lệ', () => {
      // Arrange
      const props = {
        boundedContext: 'test-context',
        actionType: 'test-action',
        entityType: 'test-entity',
        tenantId: 'test-tenant',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day' as const
      };

      // Act
      const rule = RetentionRule.create(props);

      // Assert
      AssertionHelpers.expectToContainAllProperties(rule, props);
    });
  });

  describe('toDays', () => {
    it('nên trả về đúng số ngày cho Day unit', () => {
      // Arrange
      const rule = RetentionRule.create({
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const days = rule.toDays();

      // Assert
      expect(days).toBe(30);
    });

    it('nên trả về đúng số ngày cho Month unit', () => {
      // Arrange
      const rule = RetentionRule.create({
        retentionDurationValue: 2,
        retentionDurationUnit: 'Month'
      });

      // Act
      const days = rule.toDays();

      // Assert
      expect(days).toBe(60); // 2 months * 30 days
    });

    it('nên trả về đúng số ngày cho Year unit', () => {
      // Arrange
      const rule = RetentionRule.create({
        retentionDurationValue: 1,
        retentionDurationUnit: 'Year'
      });

      // Act
      const days = rule.toDays();

      // Assert
      expect(days).toBe(365); // 1 year * 365 days
    });
  });

  describe('isApplicableTo', () => {
    it('nên trả về false khi bounded context không khớp', () => {
      // Arrange
      const rule = RetentionRule.create({
        boundedContext: 'test-context',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('other-context');

      // Assert
      expect(result).toBe(false);
    });

    it('nên trả về false khi action type không khớp', () => {
      // Arrange
      const rule = RetentionRule.create({
        boundedContext: 'test-context',
        actionType: 'test-action',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('test-context', 'other-action');

      // Assert
      expect(result).toBe(false);
    });

    it('nên trả về false khi entity type không khớp', () => {
      // Arrange
      const rule = RetentionRule.create({
        boundedContext: 'test-context',
        entityType: 'test-entity',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('test-context', undefined, 'other-entity');

      // Assert
      expect(result).toBe(false);
    });

    it('nên trả về false khi tenant id không khớp', () => {
      // Arrange
      const rule = RetentionRule.create({
        boundedContext: 'test-context',
        tenantId: 'test-tenant',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('test-context', undefined, undefined, 'other-tenant');

      // Assert
      expect(result).toBe(false);
    });

    it('nên trả về true khi tất cả điều kiện khớp', () => {
      // Arrange
      const rule = RetentionRule.create({
        boundedContext: 'test-context',
        actionType: 'test-action',
        entityType: 'test-entity',
        tenantId: 'test-tenant',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('test-context', 'test-action', 'test-entity', 'test-tenant');

      // Assert
      expect(result).toBe(true);
    });

    it('nên trả về true khi rule không có điều kiện cụ thể', () => {
      // Arrange
      const rule = RetentionRule.create({
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      // Act
      const result = rule.isApplicableTo('test-context', 'test-action', 'test-entity', 'test-tenant');

      // Assert
      expect(result).toBe(true);
    });
  });
});
