import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Value Object đại diện cho các tiêu chí dùng để truy vấn audit logs.
 */
export interface IAuditLogQueryCriteriaProps {
  readonly tenantId?: string;
  readonly initiatorType?: string;
  readonly initiatorId?: string;
  readonly boundedContext?: string;
  readonly actionType?: string;
  readonly category?: string;
  readonly severity?: string;
  readonly entityType?: string;
  readonly entityId?: string;
  readonly timestampRange?: { from?: Date; to?: Date };
  readonly createdAtRange?: { from?: Date; to?: Date };
  readonly status?: string;
  readonly contextDataFilters?: Record<string, unknown>;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

export class AuditLogQueryCriteria extends AbstractValueObject<IAuditLogQueryCriteriaProps> {
  constructor(props: IAuditLogQueryCriteriaProps) {
    super(props);
    if (!props.pageNumber || props.pageNumber < 1) throw new Error('pageNumber phải >= 1');
    if (!props.pageSize || props.pageSize < 1) throw new Error('pageSize phải >= 1');
    Object.freeze(this);
  }
  get pageNumber() { return this.props.pageNumber; }
  get pageSize() { return this.props.pageSize; }
  get tenantId() { return this.props.tenantId; }
  get sortOrder() { return this.props.sortOrder; }
}
