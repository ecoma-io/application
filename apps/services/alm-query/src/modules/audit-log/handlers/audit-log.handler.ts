import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern } from "@nestjs/microservices";

import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { NestjsLogger } from "@ecoma/nestjs-logging";

/**
 * Handler xử lý các sự kiện audit log được gửi từ các BC khác
 */
@Controller()
export class AuditLogHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: NestjsLogger
  ) {}

  /**
   * Xử lý sự kiện AuditLogRequestedEvent từ NATS
   * @param event Sự kiện audit log được gửi từ BC khác
   */
  @EventPattern("alm.events.audit.log")
  async handleAuditLogEvent(event: AuditLogRequestedEvent): Promise<void> {
    this.logger.debug("Nhận được sự kiện audit log", { event });

    try {
      // TODO: Implement query handling logic
      this.logger.debug("Xử lý thành công sự kiện audit log", {
        eventId: event.eventId,
      });
    } catch (error) {
      this.logger.error("Xử lý sự kiện audit log thất bại", {
        error,
        event,
      });
      throw error; // Let NATS handle retry
    }
  }
}
