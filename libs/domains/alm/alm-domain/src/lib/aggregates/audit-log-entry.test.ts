/**
 * @fileoverview Unit tests cho AuditLogEntry aggregate
 */

import { AuditLogEntry } from './audit-log-entry';
import { AuditLogEntryId } from '../value-objects/audit-log-entry-id';
import { Initiator } from '../value-objects/initiator';
import { AuditContext } from '../value-objects/audit-context';

describe('AuditLogEntry Aggregate', () => {
  it('nên tạo được một AuditLogEntry hợp lệ', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const eventId = '234e5678-e89b-12d3-a456-426614174001';
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Created';
    const category = 'Security';
    const severity = 'High';
    const entityId = 'user-123';
    const entityType = 'User';
    const tenantId = 'tenant-123';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'user-123',
      actionType: 'User.Created',
      entityType: 'User',
      entityId: 'user-123',
      timestamp: new Date(),
      metadata: {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        requestId: 'req-123',
      }
    });
    const status = 'Success';

    // Act
    const auditLogEntry = new AuditLogEntry({
      id,
      eventId,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      category,
      severity,
      entityId,
      entityType,
      tenantId,
      contextData,
      status,
    });

    // Assert
    expect(auditLogEntry).toBeDefined();
    expect(auditLogEntry.getIdentifier()).toBe(id.toString());
    expect(auditLogEntry.eventId).toBe(eventId);
    expect(auditLogEntry.timestamp).toBe(timestamp);
    expect(auditLogEntry.initiator).toBe(initiator);
    expect(auditLogEntry.boundedContext).toBe(boundedContext);
    expect(auditLogEntry.actionType).toBe(actionType);
    expect(auditLogEntry.category).toBe(category);
    expect(auditLogEntry.severity).toBe(severity);
    expect(auditLogEntry.entityId).toBe(entityId);
    expect(auditLogEntry.entityType).toBe(entityType);
    expect(auditLogEntry.tenantId).toBe(tenantId);
    expect(auditLogEntry.contextData).toBe(contextData);
    expect(auditLogEntry.status).toBe(status);
  });

  it('nên tạo được một AuditLogEntry với các trường tùy chọn là null', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'System',
      name: 'System',
    });
    const boundedContext = 'IAM';
    const actionType = 'System.Maintenance';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'system',
      actionType: 'System.Maintenance',
      entityType: 'System',
      entityId: 'system',
      timestamp: new Date()
    });
    const status = 'Success';

    // Act
    const auditLogEntry = new AuditLogEntry({
      id,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      contextData,
      status,
    });

    // Assert
    expect(auditLogEntry).toBeDefined();
    expect(auditLogEntry.getIdentifier()).toBe(id.toString());
    expect(auditLogEntry.eventId).toBeNull();
    expect(auditLogEntry.timestamp).toBe(timestamp);
    expect(auditLogEntry.initiator).toBe(initiator);
    expect(auditLogEntry.boundedContext).toBe(boundedContext);
    expect(auditLogEntry.actionType).toBe(actionType);
    expect(auditLogEntry.category).toBeNull();
    expect(auditLogEntry.severity).toBeNull();
    expect(auditLogEntry.entityId).toBeNull();
    expect(auditLogEntry.entityType).toBeNull();
    expect(auditLogEntry.tenantId).toBeNull();
    expect(auditLogEntry.contextData).toBe(contextData);
    expect(auditLogEntry.status).toBe(status);
  });

  it('nên tạo thời gian createdAt khi khởi tạo', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Created';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'user-123',
      actionType: 'User.Created',
      entityType: 'User',
      entityId: 'user-123',
      timestamp: new Date()
    });
    const status = 'Success';

    // Act
    const beforeCreate = new Date();
    const auditLogEntry = new AuditLogEntry({
      id,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      contextData,
      status,
    });
    const afterCreate = new Date();

    // Assert
    expect(auditLogEntry.createdAt).toBeDefined();
    expect(auditLogEntry.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(auditLogEntry.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });

  it('nên throw lỗi khi thiếu trường bắt buộc', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Created';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'user-123',
      actionType: 'User.Created',
      entityType: 'User',
      entityId: 'user-123',
      timestamp: new Date()
    });

    // Act & Assert - Thiếu status
    expect(() => {
      new AuditLogEntry({
        id,
        timestamp,
        initiator,
        boundedContext,
        actionType,
        contextData,
      } as any);
    }).toThrow();

    // Act & Assert - Thiếu boundedContext
    expect(() => {
      new AuditLogEntry({
        id,
        timestamp,
        initiator,
        actionType,
        contextData,
        status: 'Success',
      } as any);
    }).toThrow();

    // Act & Assert - Thiếu actionType
    expect(() => {
      new AuditLogEntry({
        id,
        timestamp,
        initiator,
        boundedContext,
        contextData,
        status: 'Success',
      } as any);
    }).toThrow();
  });

  it('nên đặt failureReason khi status là Failure', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Login';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'user-123',
      actionType: 'User.Login',
      entityType: 'User',
      entityId: 'user-123',
      timestamp: new Date()
    });
    const status = 'Failure';
    const failureReason = 'Invalid credentials';

    // Act
    const auditLogEntry = new AuditLogEntry({
      id,
      timestamp,
      initiator,
      boundedContext,
      actionType,
      contextData,
      status,
      failureReason,
    });

    // Assert
    expect(auditLogEntry.status).toBe('Failure');
    expect(auditLogEntry.failureReason).toBe(failureReason);
  });

  it('nên throw lỗi khi status là Failure nhưng không có failureReason', () => {
    // Arrange
    const id = new AuditLogEntryId('123e4567-e89b-12d3-a456-426614174000');
    const timestamp = new Date();
    const initiator = Initiator.create({
      type: 'User',
      id: 'user-123',
      name: 'test.user@example.com',
    });
    const boundedContext = 'IAM';
    const actionType = 'User.Login';
    const contextData = AuditContext.create({
      boundedContext: 'IAM',
      tenantId: 'tenant-123',
      userId: 'user-123',
      actionType: 'User.Login',
      entityType: 'User',
      entityId: 'user-123',
      timestamp: new Date()
    });
    const status = 'Failure';

    // Act & Assert
    expect(() => {
      new AuditLogEntry({
        id,
        timestamp,
        initiator,
        boundedContext,
        actionType,
        contextData,
        status,
      });
    }).toThrow();
  });
});
