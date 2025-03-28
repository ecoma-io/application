/**
 * @fileoverview Unit tests cho PersistAuditLogHandler
 */

import { Test } from '@nestjs/testing';
import { PersistAuditLogHandler } from './persist-audit-log.handler';
import { PersistAuditLogCommand } from '../commands/persist-audit-log.command';
import { AuditLogService } from '../services/audit-log.service';
import { Initiator } from '@ecoma/alm-domain';

describe('PersistAuditLogHandler', () => {
  let handler: PersistAuditLogHandler;
  let mockAuditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    // Tạo mock cho service
    mockAuditLogService = {
      persistAuditLogEntry: jest.fn().mockResolvedValue(undefined),
      findAuditLogs: jest.fn(),
    } as unknown as jest.Mocked<AuditLogService>;

    // Khởi tạo module test với các dependency mocked
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
        {
          provide: PersistAuditLogHandler,
          useFactory: () => new PersistAuditLogHandler(mockAuditLogService),
        },
      ],
    }).compile();

    handler = moduleRef.get<PersistAuditLogHandler>(PersistAuditLogHandler);
  });

  it('nên gọi auditLogService.persistAuditLogEntry với các tham số đúng', async () => {
    // Arrange
    const eventId = '234e5678-e89b-12d3-a456-426614174001';
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Created';
    const tenantId = 'tenant-123';
    const category = 'Security';
    const severity = 'High';
    const entityId = 'user-123';
    const entityType = 'User';
    const description = 'User created successfully';
    const status = 'Success';

    const command = new PersistAuditLogCommand(
      eventId,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      tenantId,
      category,
      severity,
      entityId,
      entityType,
      description,
      status
    );

    // Act
    await handler.handle(command);

    // Assert
    expect(mockAuditLogService.persistAuditLogEntry).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.persistAuditLogEntry).toHaveBeenCalledWith(expect.objectContaining({
      eventId: command.eventId,
      timestamp: command.timestamp,
      initiator: command.initiator,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      category: command.category,
      severity: command.severity,
      entityId: command.entityId,
      entityType: command.entityType,
      tenantId: command.tenantId,
      status: command.status,
    }));
  });

  it('nên xử lý đúng trường hợp status là Failure với failureReason', async () => {
    // Arrange
    const eventId = '234e5678-e89b-12d3-a456-426614174001';
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Login';
    const status = 'Failure';
    const failureReason = 'Invalid credentials';

    const command = new PersistAuditLogCommand(
      eventId,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      undefined, // tenantId
      undefined, // category
      undefined, // severity
      undefined, // entityId
      undefined, // entityType
      undefined, // description
      status,
      failureReason
    );

    // Act
    await handler.handle(command);

    // Assert
    expect(mockAuditLogService.persistAuditLogEntry).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.persistAuditLogEntry).toHaveBeenCalledWith(expect.objectContaining({
      failureReason: command.failureReason,
      status: command.status,
    }));
  });

  it('nên throw lỗi khi service.persistAuditLogEntry() thất bại', async () => {
    // Arrange
    const eventId = '234e5678-e89b-12d3-a456-426614174001';
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Created';
    const status = 'Success';

    const command = new PersistAuditLogCommand(
      eventId,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      undefined, // tenantId
      undefined, // category
      undefined, // severity
      undefined, // entityId
      undefined, // entityType
      undefined, // description
      status
    );

    // Mock service để throw lỗi
    const mockError = new Error('Database connection failed');
    mockAuditLogService.persistAuditLogEntry.mockRejectedValue(mockError);

    // Act & Assert
    await expect(handler.handle(command)).rejects.toThrow(mockError);
    expect(mockAuditLogService.persistAuditLogEntry).toHaveBeenCalledTimes(1);
  });
});
