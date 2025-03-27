import { AuditLogQueryAuthorizationPolicy } from './audit-log-query-authorization.policy';

describe('AuditLogQueryAuthorizationPolicy', () => {
  let policy: AuditLogQueryAuthorizationPolicy;

  beforeEach(() => {
    policy = new AuditLogQueryAuthorizationPolicy();
  });

  it('Trả về true nếu user có role admin', async () => {
    const user = { id: '1', roles: ['admin'] };
    const allowed = await policy.canQueryAuditLogs(user, {});
    expect(allowed).toBe(true);
  });

  it('Trả về true nếu user có role audit-log-viewer', async () => {
    const user = { id: '2', roles: ['audit-log-viewer'] };
    const allowed = await policy.canQueryAuditLogs(user, {});
    expect(allowed).toBe(true);
  });

  it('Trả về false nếu user không có quyền', async () => {
    const user = { id: '3', roles: ['user'] };
    const allowed = await policy.canQueryAuditLogs(user, {});
    expect(allowed).toBe(false);
  });
});
