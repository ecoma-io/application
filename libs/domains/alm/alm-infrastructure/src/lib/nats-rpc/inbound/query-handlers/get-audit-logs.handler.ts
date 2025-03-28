import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { QueryBus } from '@nestjs/cqrs';
import { GetAuditLogsQuery } from '@ecoma/alm-application';
import { AuditLogEntry } from '@ecoma/alm-domain';

@Controller()
export class GetAuditLogsNatsHandler {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern('alm.query.get_audit_logs')
  async handle(data: any): Promise<AuditLogEntry[]> {
    const query = new GetAuditLogsQuery(
      data.criteria,
      data.userId
    );

    return this.queryBus.execute(query);
  }
}
