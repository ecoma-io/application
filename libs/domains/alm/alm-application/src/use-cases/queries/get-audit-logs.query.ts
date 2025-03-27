import { GetAuditLogsQueryDto } from '../../dtos/queries';

/**
 * Query object cho use case get audit logs
 */
export class GetAuditLogsQuery {
  constructor(public readonly payload: GetAuditLogsQueryDto) {}
}
