import { AuditLogQueryCriteria } from './audit-log-query-criteria.vo';

describe('AuditLogQueryCriteria VO', () => {
  it('khởi tạo hợp lệ', () => {
    const vo = new AuditLogQueryCriteria({
      tenantId: 't1',
      pageNumber: 1,
      pageSize: 20,
      sortOrder: 'asc',
    });
    expect(vo.tenantId).toBe('t1');
    expect(vo.pageNumber).toBe(1);
    expect(vo.pageSize).toBe(20);
    expect(vo.sortOrder).toBe('asc');
  });

  it('bất biến: không cho phép thay đổi props', () => {
    const vo = new AuditLogQueryCriteria({ pageNumber: 1, pageSize: 10 });
    // @ts-expect-error: Test bất biến, không cho phép thay đổi props
    expect(() => { vo.pageNumber = 2; }).toThrow();
  });

  it('so sánh equals đúng', () => {
    const a = new AuditLogQueryCriteria({ pageNumber: 1, pageSize: 10 });
    const b = new AuditLogQueryCriteria({ pageNumber: 1, pageSize: 10 });
    const c = new AuditLogQueryCriteria({ pageNumber: 2, pageSize: 10 });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('ném lỗi khi pageNumber/pageSize không hợp lệ', () => {
    expect(() => new AuditLogQueryCriteria({ pageNumber: 0, pageSize: 10 })).toThrow('pageNumber phải >= 1');
    expect(() => new AuditLogQueryCriteria({ pageNumber: 1, pageSize: 0 })).toThrow('pageSize phải >= 1');
  });
});
