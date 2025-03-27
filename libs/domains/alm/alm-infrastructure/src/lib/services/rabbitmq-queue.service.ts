import { IQueueService } from "@ecoma/alm-application";
import { AbstractLogger } from "@ecoma/common-application";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

const EXCHANGE_NAME = "alm";
const ROUTING_KEY = "audit-log.deletion";

@Injectable()
export class RabbitMQQueueService implements IQueueService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(RabbitMQQueueService.name);
  }

  async queueAuditLogsForDeletion(auditLogIds: string[]): Promise<void> {
    try {
      await this.amqpConnection.publish(EXCHANGE_NAME, ROUTING_KEY, {
        auditLogIds,
      });

      this.logger.debug(
        `Published ${auditLogIds.length} audit log IDs for deletion`
      );
    } catch (error) {
      this.logger.error(
        "Failed to publish audit log deletion message",
        error as Error
      );
      throw error;
    }
  }
}
