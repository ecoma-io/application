import { RetentionPolicy } from './retention-policy';
import { RetentionRule } from './retention-rule';
import { AssertionHelpers } from '@ecoma/common-testing';

describe('RetentionPolicy', () => {
  describe('create', () => {
    it('nên throw lỗi khi tên policy trống', () => {
      // Arrange
      const props = {
        name: '',
        description: 'Test Description',
        rules: [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day',
          boundedContext: 'test-context',
          actionType: 'DELETE',
          entityType: 'User',
          tenantId: 'tenant-123'
        })],
        isActive: true,
        boundedContext: 'test-context',
        tenantId: 'tenant-123'
      };

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionPolicy.create(props),
        'Policy name is required'
      );
    });

    it('nên throw lỗi khi không có rules', () => {
      // Arrange
      const props = {
        name: 'Test Policy',
        description: 'Test Description',
        rules: [],
        isActive: true,
        boundedContext: 'test-context',
        tenantId: 'tenant-123'
      };

      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(
        () => RetentionPolicy.create(props),
        'At least one retention rule is required'
      );
    });

    it('nên tạo policy với các giá trị hợp lệ', () => {
      // Arrange
      const props = {
        name: 'Test Policy',
        description: 'Test Description',
        rules: [RetentionRule.create({
          retentionDurationValue: 30,
          retentionDurationUnit: 'Day',
          boundedContext: 'test-context',
          actionType: 'DELETE',
          entityType: 'User',
          tenantId: 'tenant-123'
        })],
        isActive: true,
        boundedContext: 'test-context',
        tenantId: 'tenant-123'
      };

      // Act
      const policy = RetentionPolicy.create(props);

      // Assert
      AssertionHelpers.expectToContainAllProperties(policy, {
        name: props.name,
        description: props.description,
        isActive: props.isActive,
        boundedContext: props.boundedContext,
        tenantId: props.tenantId
      });
      expect(policy.rules).toHaveLength(1);
    });
  });
});
