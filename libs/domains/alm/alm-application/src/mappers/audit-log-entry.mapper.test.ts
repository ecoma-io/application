import 'reflect-metadata';
import { AuditLogEntryMapper } from './audit-log-entry.mapper';
import { IngestAuditLogCommandDto, AuditLogStatus } from '../dtos/commands/ingest-audit-log.command.dto';

describe('AuditLogEntryMapper', () => {
  it('Mapping fromIngestDto trả về object đầy đủ trường', () => {
    const dto: IngestAuditLogCommandDto = {
      timestamp: '2024-01-01T00:00:00Z',
      initiator: { type: 'User', id: 'u1', name: 'A' },
      boundedContext: 'IAM',
      actionType: 'User.Created',
      category: 'Security',
      severity: 'High',
      entityId: 'e1',
      entityType: 'User',
      tenantId: 't1',
      contextData: { value: { ip: '1.2.3.4' } },
      status: AuditLogStatus.Success,
      failureReason: undefined,
      eventId: 'ev1',
      issuedAt: '2024-01-01T00:00:00Z',
    };
    const result = AuditLogEntryMapper.fromIngestDto(dto);
    expect(result).toMatchObject({
      eventId: 'ev1',
      timestamp: '2024-01-01T00:00:00Z',
      initiator: { type: 'User', id: 'u1', name: 'A' },
      boundedContext: 'IAM',
      actionType: 'User.Created',
      category: 'Security',
      severity: 'High',
      entityId: 'e1',
      entityType: 'User',
      tenantId: 't1',
      contextData: { ip: '1.2.3.4' },
      status: 'Success',
      failureReason: undefined,
    });
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });

  it('Mapping toQueryDto trả về đúng dữ liệu', () => {
    const entry = {
      id: 'id1',
      eventId: 'ev1',
      timestamp: '2024-01-01T00:00:00Z',
      initiator: { type: 'User', id: 'u1', name: 'A' },
      boundedContext: 'IAM',
      actionType: 'User.Created',
      category: 'Security',
      severity: 'High',
      entityId: 'e1',
      entityType: 'User',
      tenantId: 't1',
      contextData: { ip: '1.2.3.4' },
      status: 'Success',
      failureReason: undefined,
      createdAt: '2024-01-01T01:00:00Z',
    };
    const dto = AuditLogEntryMapper.toQueryDto(entry);
    expect(dto).toEqual({ ...entry });
  });
});
