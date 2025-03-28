import { AuditContext } from './audit-context';

describe('AuditContext', () => {
  describe('create', () => {
    it('nên tạo audit context với các giá trị hợp lệ', () => {
      // Arrange
      const props = {
        boundedContext: 'test-context',
        tenantId: 'tenant-123',
        userId: 'user-123',
        actionType: 'CREATE',
        entityType: 'User',
        entityId: 'entity-123',
        timestamp: new Date()
      };

      // Act
      const auditContext = AuditContext.create(props);

      // Assert
      expect(auditContext.value).toEqual(props);
    });
  });
});
