/**
 * @fileoverview Unit tests cho AuditLogMongoRepository
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLogMongoRepository } from './audit-log.repository';
import { AuditLogEntryEntity } from '../entities/audit-log-entry.entity';
import { AuditLogEntry, AuditLogEntryId, Initiator, AuditContext } from '@ecoma/alm-domain';
import { IQuerySpecification } from '@ecoma/common-domain';

// Create a simple implementation of IQuerySpecification for testing
class SimpleQuerySpecification<T> implements IQuerySpecification<T> {
  getFilters(): Array<{ field: keyof T; operator: string; value: unknown }> {
    return [];
  }

  getSorts(): Array<{ field: keyof T; direction: 'asc' | 'desc' }> {
    return [];
  }

  getLimit(): number {
    return 10;
  }

  getOffset(): number {
    return 0;
  }
}

describe('AuditLogMongoRepository', () => {
  let repository: AuditLogMongoRepository;
  let auditLogModel: Model<AuditLogEntryEntity>;

  // Mock data
  const mockId = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
  const mockEventId = 'event-123';
  const mockTimestamp = new Date('2023-01-01T12:00:00Z');
  const mockInitiator = Initiator.create({
    type: 'User',
    id: 'user-123',
    name: 'John Doe'
  });
  const mockBoundedContext = 'IAM';
  const mockActionType = 'User.Created';
  const mockCategory = 'Security';
  const mockSeverity = 'High';
  const mockEntityId = 'entity-123';
  const mockEntityType = 'User';
  const mockTenantId = 'tenant-123';
  const mockContextData = AuditContext.create({
    boundedContext: 'IAM',
    tenantId: 'tenant-123',
    userId: 'user-123',
    actionType: 'User.Created',
    entityType: 'User',
    entityId: 'entity-123',
    timestamp: new Date(),
    metadata: { ipAddress: '192.168.1.1' }
  });

  const mockAuditLogEntry = new AuditLogEntry({
    id: mockId,
    eventId: mockEventId,
    timestamp: mockTimestamp,
    initiator: mockInitiator,
    boundedContext: mockBoundedContext,
    actionType: mockActionType,
    category: mockCategory,
    severity: mockSeverity,
    entityId: mockEntityId,
    entityType: mockEntityType,
    tenantId: mockTenantId,
    contextData: mockContextData,
    status: 'Success',
    failureReason: null
  });

  const mockAuditLogEntityDocument = {
    id: mockId.value,
    eventId: mockEventId,
    timestamp: mockTimestamp,
    initiator: {
      type: mockInitiator.type,
      id: mockInitiator.id,
      name: mockInitiator.name
    },
    boundedContext: mockBoundedContext,
    actionType: mockActionType,
    tenantId: mockTenantId,
    category: mockCategory,
    severity: mockSeverity,
    entityId: mockEntityId,
    entityType: mockEntityType,
    status: 'Success',
    failureReason: null,
    contextData: {
      ipAddress: '192.168.1.1'
    },
    toObject: jest.fn().mockReturnThis()
  };

  // Mock model
  const mockAuditLogModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogMongoRepository,
        {
          provide: getModelToken(AuditLogEntryEntity.name),
          useValue: mockAuditLogModel,
        },
      ],
    }).compile();

    repository = module.get<AuditLogMongoRepository>(AuditLogMongoRepository);
    auditLogModel = module.get<Model<AuditLogEntryEntity>>(getModelToken(AuditLogEntryEntity.name));

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock returns
    mockAuditLogModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAuditLogEntityDocument),
    });
    mockAuditLogModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockAuditLogEntityDocument]),
    });
    mockAuditLogModel.findOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAuditLogEntityDocument),
    });
    mockAuditLogModel.deleteOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });
    mockAuditLogModel.deleteMany.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 2 }),
    });
    mockAuditLogModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
  });

  it('nên khởi tạo được repository', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('nên trả về AuditLogEntry khi tìm thấy theo ID', async () => {
      // Act
      const result = await repository.findById(mockId);

      // Assert
      expect(auditLogModel.findOne).toHaveBeenCalledWith({ id: mockId.value });
      expect(result).toBeInstanceOf(AuditLogEntry);
      expect(result?.getIdentifier()).toBe(mockId.toString());
    });

    it('nên trả về null khi không tìm thấy theo ID', async () => {
      // Arrange
      mockAuditLogModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      // Act
      const result = await repository.findById(mockId);

      // Assert
      expect(auditLogModel.findOne).toHaveBeenCalledWith({ id: mockId.value });
      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('nên trả về true khi audit log tồn tại', async () => {
      // Act
      const result = await repository.exists(mockId);

      // Assert
      expect(auditLogModel.countDocuments).toHaveBeenCalledWith({ id: mockId.value });
      expect(result).toBe(true);
    });

    it('nên trả về false khi audit log không tồn tại', async () => {
      // Arrange
      mockAuditLogModel.countDocuments.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(0),
      });

      // Act
      const result = await repository.exists(mockId);

      // Assert
      expect(auditLogModel.countDocuments).toHaveBeenCalledWith({ id: mockId.value });
      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('nên lưu audit log vào database', async () => {
      // Act
      await repository.save(mockAuditLogEntry);

      // Assert
      expect(auditLogModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: mockId.value },
        expect.objectContaining({
          id: mockId.value,
          eventId: mockEventId,
          boundedContext: mockBoundedContext,
          actionType: mockActionType,
        }),
        { upsert: true, new: true }
      );
    });
  });

  describe('saveMany', () => {
    it('nên lưu nhiều audit log vào database', async () => {
      // Arrange
      const mockAuditLogEntry2 = new AuditLogEntry({
        id: new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174001'),
        eventId: 'event-456',
        timestamp: new Date(),
        initiator: mockInitiator,
        boundedContext: mockBoundedContext,
        actionType: 'User.Updated',
        tenantId: mockTenantId,
        contextData: mockContextData,
        status: 'Success'
      });

      // Act
      await repository.saveMany([mockAuditLogEntry, mockAuditLogEntry2]);

      // Assert
      expect(auditLogModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('nên xóa audit log theo ID', async () => {
      // Act
      await repository.delete(mockId);

      // Assert
      expect(auditLogModel.deleteOne).toHaveBeenCalledWith({ id: mockId.value });
    });
  });

  describe('deleteMany', () => {
    it('nên xóa nhiều audit log theo danh sách ID', async () => {
      // Arrange
      const ids = [mockId, new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174001')];

      // Act
      await repository.deleteMany(ids);

      // Assert
      expect(auditLogModel.deleteMany).toHaveBeenCalledWith({
        id: { $in: ids.map(id => id.value) }
      });
    });
  });

  describe('findByTenantId', () => {
    it('nên tìm audit logs theo tenant ID', async () => {
      // Act
      const result = await repository.findByTenantId(mockTenantId);

      // Assert
      expect(auditLogModel.find).toHaveBeenCalledWith({ tenantId: mockTenantId });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(AuditLogEntry);
    });
  });

  describe('findByBoundedContext', () => {
    it('nên tìm audit logs theo bounded context', async () => {
      // Act
      const result = await repository.findByBoundedContext(mockBoundedContext);

      // Assert
      expect(auditLogModel.find).toHaveBeenCalledWith({ boundedContext: mockBoundedContext });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(AuditLogEntry);
    });
  });

  describe('findByDateRange', () => {
    it('nên tìm audit logs trong khoảng thời gian', async () => {
      // Arrange
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-02');

      // Act
      const result = await repository.findByDateRange(startDate, endDate);

      // Assert
      expect(auditLogModel.find).toHaveBeenCalledWith({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(AuditLogEntry);
    });
  });

  describe('findWithOffsetPagination', () => {
    it('nên trả về kết quả phân trang với offset pagination', async () => {
      // Arrange
      const query = new SimpleQuerySpecification<AuditLogEntry>();
      const pagination = { offset: 0, limit: 10 };

      // Act
      const result = await repository.findWithOffsetPagination(query, pagination);

      // Assert
      expect(auditLogModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        items: expect.any(Array),
        total: 1,
        offset: 0,
        limit: 10
      });
      expect(result.items[0]).toBeInstanceOf(AuditLogEntry);
    });
  });

  describe('deleteByRetentionPolicy', () => {
    it('nên xóa audit logs cũ hơn ngày được chỉ định', async () => {
      // Arrange
      const olderThan = new Date('2023-01-01');

      // Act
      await repository.deleteByRetentionPolicy(olderThan);

      // Assert
      expect(auditLogModel.deleteMany).toHaveBeenCalledWith({
        timestamp: { $lt: olderThan }
      });
    });
  });
});
