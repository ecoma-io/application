import { AlmWorkerApplicationService } from "@ecoma/alm-application";
import { AbstractLogger } from "@ecoma/common-application";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuditLogDeletionConsumer {
  constructor(
    private readonly applicationService: AlmWorkerApplicationService,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(AuditLogDeletionConsumer.name);
  }

  @RabbitSubscribe({
    exchange: "alm.events",
    routingKey: "audit.log.deletion",
    queue: "audit-log-deletion",
  })
  async handleDeletionMessage(message: { auditLogIds: string[] }) {
    try {
      const deletedCount = await this.applicationService.deleteAuditLogs({
        auditLogIds: message.auditLogIds,
      });
      this.logger.info(
        `Successfully deleted ${deletedCount} audit log entries`
      );
    } catch (error) {
      this.logger.error(`Failed to delete audit log entries`, error as Error);
      throw error;
    }
  }
}
