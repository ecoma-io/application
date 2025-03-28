import { RetentionPolicy } from './retention-policy';
import { RetentionPolicyId, RetentionRule } from '../value-objects';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('RetentionPolicy', () => {
  describe('create', () => {
    it('nên throw lỗi khi tên policy trống', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const name = '';
      const description = 'Test Description';
      const rules: RetentionRule[] = [];

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionPolicy.create(id, name, description, rules),
        'Policy name is required'
      );
    });

    it('nên throw lỗi khi không có rules', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const name = 'Test Policy';
      const description = 'Test Description';
      const rules: RetentionRule[] = [];

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionPolicy.create(id, name, description, rules),
        'At least one retention rule is required'
      );
    });

    it('nên tạo policy với các giá trị hợp lệ', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const name = 'Test Policy';
      const description = 'Test Description';
      const rules = [RetentionRule.create({
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      })];

      // Act
      const policy = RetentionPolicy.create(id, name, description, rules);

      // Assert
      AssertionHelpers.expectToContainAllProperties(policy, {
        name,
        description
      });
      expect(policy.rules).toHaveLength(1);
      expect(policy.actived).toBe(true);
    });
  });

  describe('update', () => {
    it('nên throw lỗi khi tên policy trống', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => policy.update('', 'New Description', []),
        'Policy name is required'
      );
    });

    it('nên throw lỗi khi không có rules', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => policy.update('New Name', 'New Description', []),
        'At least one retention rule is required'
      );
    });

    it('nên update policy với các giá trị hợp lệ', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );

      const newRules = [RetentionRule.create({
        retentionDurationValue: 60,
        retentionDurationUnit: 'Day'
      })];

      // Act
      policy.update('New Name', 'New Description', newRules);

      // Assert
      AssertionHelpers.expectToContainAllProperties(policy, {
        name: 'New Name',
        description: 'New Description'
      });
      expect(policy.rules).toEqual(newRules);
    });
  });

  describe('activate', () => {
    it('nên không thay đổi gì khi policy đã active', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );

      // Act
      policy.activate();

      // Assert
      expect(policy.actived).toBe(true);
    });

    it('nên activate policy khi đang inactive', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );
      policy.deactivate();

      // Act
      policy.activate();

      // Assert
      expect(policy.actived).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('nên không thay đổi gì khi policy đã inactive', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );
      policy.deactivate();

      // Act
      policy.deactivate();

      // Assert
      expect(policy.actived).toBe(false);
    });

    it('nên deactivate policy khi đang active', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );

      // Act
      policy.deactivate();

      // Assert
      expect(policy.actived).toBe(false);
    });
  });

  describe('findApplicableRule', () => {
    it('nên trả về null khi policy không active', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );
      policy.deactivate();

      // Act
      const result = policy.findApplicableRule('test-context');

      // Assert
      expect(result).toBeNull();
    });

    it('nên trả về rule phù hợp nhất', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const specificRule = RetentionRule.create({
        boundedContext: 'test-context',
        actionType: 'test-action',
        retentionDurationValue: 30,
        retentionDurationUnit: 'Day'
      });

      const generalRule = RetentionRule.create({
        boundedContext: 'test-context',
        retentionDurationValue: 60,
        retentionDurationUnit: 'Day'
      });

      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [generalRule, specificRule]
      );

      // Act
      const result = policy.findApplicableRule('test-context', 'test-action');

      // Assert
      expect(result).toBe(specificRule);
    });
  });

  describe('shouldDelete', () => {
    it('nên trả về false khi policy không active', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day'
        })]
      );
      policy.deactivate();

      // Act
      const result = policy.shouldDelete('test-context', new Date());

      // Assert
      expect(result).toBe(false);
    });

    it('nên trả về true khi entry đã quá thời gian retention', () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const policy = RetentionPolicy.create(
        id,
        'Test Policy',
        'Test Description',
        [RetentionRule.create({
          boundedContext: 'test-context',
          retentionDurationValue: 1,
          retentionDurationUnit: 'Day'
        })]
      );

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2);

      // Act
      const result = policy.shouldDelete('test-context', oldDate);

      // Assert
      expect(result).toBe(true);
    });
  });
});
