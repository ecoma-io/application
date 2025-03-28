import { RetentionPolicyService } from './retention-policy.service';
import { IRetentionPolicyReadRepository, IRetentionPolicyWriteRepository } from '../repositories';
import { IEventBus } from '@ecoma/common-domain';
import { RetentionPolicyId, RetentionRule } from '../value-objects';
import { RetentionPolicy } from '../aggregates';

describe('RetentionPolicyService', () => {
  let service: RetentionPolicyService;
  let readRepository: jest.Mocked<IRetentionPolicyReadRepository>;
  let writeRepository: jest.Mocked<IRetentionPolicyWriteRepository>;
  let eventBus: jest.Mocked<IEventBus>;

  beforeEach(() => {
    readRepository = {
      findById: jest.fn(),
      find: jest.fn(),
      findWithOffsetPagination: jest.fn(),
      findWithCursorPagination: jest.fn(),
      findByBoundedContext: jest.fn(),
      findByTenantId: jest.fn(),
      findActive: jest.fn(),
      findByActionType: jest.fn(),
      findByEntityType: jest.fn(),
      findByRetentionDuration: jest.fn(),
    };

    writeRepository = {
      save: jest.fn(),
      update: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
      updateRules: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    };

    eventBus = {
      publish: jest.fn(),
    };

    service = new RetentionPolicyService(readRepository, writeRepository, eventBus);
  });

  describe('createPolicy', () => {
    it('nên tạo policy mới và publish event', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const name = 'Test Policy';
      const description = 'Test Description';
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policy = RetentionPolicy.create(id, name, description, rules);
      writeRepository.save.mockResolvedValue(undefined);
      readRepository.findById.mockResolvedValue(policy);

      // Act
      const result = await service.createPolicy(id, name, description, rules);

      // Assert
      expect(result.getIdentifier()).toBe(policy.getIdentifier());
      expect(result.name).toBe(policy.name);
      expect(result.description).toBe(policy.description);
      expect(result.rules).toEqual(policy.rules);
      expect(writeRepository.save).toHaveBeenCalledWith(expect.any(RetentionPolicy));
      expect(eventBus.publish).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('updatePolicy', () => {
    it('nên throw lỗi khi policy không tồn tại', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      readRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updatePolicy(id, 'name', 'desc', [])).rejects.toThrow('Policy not found');
    });

    it('nên update policy và publish event', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policy = RetentionPolicy.create(id, 'old', 'old', rules);
      readRepository.findById.mockResolvedValue(policy);
      writeRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await service.updatePolicy(id, 'new', 'new', rules);

      // Assert
      expect(result).toEqual(policy);
      expect(writeRepository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(policy.getDomainEvents());
    });
  });

  describe('activatePolicy', () => {
    it('nên throw lỗi khi policy không tồn tại', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      readRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.activatePolicy(id)).rejects.toThrow('Policy not found');
    });

    it('nên activate policy và publish event', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policy = RetentionPolicy.create(id, 'name', 'desc', rules);
      readRepository.findById.mockResolvedValue(policy);
      writeRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await service.activatePolicy(id);

      // Assert
      expect(result).toEqual(policy);
      expect(writeRepository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(policy.getDomainEvents());
    });
  });

  describe('deactivatePolicy', () => {
    it('nên throw lỗi khi policy không tồn tại', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      readRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deactivatePolicy(id)).rejects.toThrow('Policy not found');
    });

    it('nên deactivate policy và publish event', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policy = RetentionPolicy.create(id, 'name', 'desc', rules);
      readRepository.findById.mockResolvedValue(policy);
      writeRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await service.deactivatePolicy(id);

      // Assert
      expect(result).toEqual(policy);
      expect(writeRepository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(policy.getDomainEvents());
    });
  });

  describe('getPolicy', () => {
    it('nên trả về policy khi tìm thấy', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policy = RetentionPolicy.create(id, 'name', 'desc', rules);
      readRepository.findById.mockResolvedValue(policy);

      // Act
      const result = await service.getPolicy(id);

      // Assert
      expect(result).toBe(policy);
      expect(readRepository.findById).toHaveBeenCalledWith(id);
    });

    it('nên trả về null khi không tìm thấy', async () => {
      // Arrange
      const id = RetentionPolicyId.generate();
      readRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.getPolicy(id);

      // Assert
      expect(result).toBeNull();
      expect(readRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('getAllPolicies', () => {
    it('nên trả về tất cả policies', async () => {
      // Arrange
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policies = [
        RetentionPolicy.create(RetentionPolicyId.generate(), 'name1', 'desc1', rules),
        RetentionPolicy.create(RetentionPolicyId.generate(), 'name2', 'desc2', rules),
      ];
      readRepository.find.mockResolvedValue(policies);

      // Act
      const result = await service.getAllPolicies();

      // Assert
      expect(result).toBe(policies);
      expect(readRepository.find).toHaveBeenCalled();
    });
  });

  describe('getActivePolicies', () => {
    it('nên trả về các active policies', async () => {
      // Arrange
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policies = [
        RetentionPolicy.create(RetentionPolicyId.generate(), 'name1', 'desc1', rules),
      ];
      readRepository.find.mockResolvedValue(policies);

      // Act
      const result = await service.getActivePolicies();

      // Assert
      expect(result).toBe(policies);
      expect(readRepository.find).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('getPoliciesByBoundedContext', () => {
    it('nên trả về policies theo bounded context', async () => {
      // Arrange
      const boundedContext = 'test-context';
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policies = [
        RetentionPolicy.create(RetentionPolicyId.generate(), 'name1', 'desc1', rules),
      ];
      readRepository.find.mockResolvedValue(policies);

      // Act
      const result = await service.getPoliciesByBoundedContext(boundedContext);

      // Assert
      expect(result).toBe(policies);
      expect(readRepository.find).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('getPoliciesByTenantId', () => {
    it('nên trả về policies theo tenant id', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const rules = [
        RetentionRule.create({
          boundedContext: 'test-context',
          tenantId: 'test-tenant',
          actionType: 'CREATE',
          entityType: 'User',
          retentionDurationUnit: 'Day',
          retentionDurationValue: 30,
        }),
      ];
      const policies = [
        RetentionPolicy.create(RetentionPolicyId.generate(), 'name1', 'desc1', rules),
      ];
      readRepository.find.mockResolvedValue(policies);

      // Act
      const result = await service.getPoliciesByTenantId(tenantId);

      // Assert
      expect(result).toBe(policies);
      expect(readRepository.find).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
