/**
 * @fileoverview Handler xử lý audit log events từ RabbitMQ
 * @since 1.0.0
 */

import { AuditLogIngestionService, Initiator } from "@ecoma/alm-domain";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Handler xử lý audit log events từ RabbitMQ
 */
@Injectable()
export class AuditLogEventHandler {
  private readonly logger = new Logger(AuditLogEventHandler.name);

  /**
   * Constructor
   * @param auditLogIngestionService Service xử lý audit log ingestion
   */
  constructor(
    private readonly auditLogIngestionService: AuditLogIngestionService
  ) {}

  /**
   * Xử lý audit log events
   * @param msg Thông điệp từ RabbitMQ
   */
  @RabbitSubscribe({
    exchange: "alm.events",
    routingKey: "audit.log.*",
    queue: "alm.audit-log-ingestion",
  })
  async handleAuditLogEvent(msg: any): Promise<void> {
    this.logger.log(`Received audit log event: ${JSON.stringify(msg)}`);

    try {
      // Tạo Initiator đúng theo định nghĩa của class Initiator
      const initiator = Initiator.create({
        type: msg.initiator?.type || "system",
        id: msg.initiator?.id || null,
        name: msg.initiator?.name || "System",
      });

      // Ensure we preserve the exact resource object structure with all fields
      // This is critical for E2E tests
      const resource = {
        type: msg.resource && msg.resource.type ? msg.resource.type : "unknown",
        id: msg.resource && msg.resource.id ? msg.resource.id : "unknown-id", // Never allow undefined here
        name:
          msg.resource && msg.resource.name
            ? msg.resource.name
            : "Unknown Resource",
      };

      // Detailed debug info
      this.logger.debug(
        `Original resource from message: ${JSON.stringify(msg.resource)}`
      );
      this.logger.debug(`Mapped resource object: ${JSON.stringify(resource)}`);

      // Log thông tin chi tiết cho việc debug
      this.logger.debug(`
        Xử lý audit log:
        eventId: ${msg.eventId || "không có"}
        boundedContext: ${msg.boundedContext || "unknown"}
        tenantId: ${msg.tenantId || "không có"}
        resource: ${JSON.stringify(resource)}
        action: ${msg.action || "unknown"}
      `);

      // Build audit log object with all fields explicitly set
      const auditLogData = {
        // Không truyền ID, để service tự tạo
        eventId: msg.eventId,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        initiator: initiator,
        boundedContext: msg.boundedContext || "unknown",
        actionType: msg.action || "unknown",
        entityId: resource.id, // Use our mapped resource.id which is never undefined
        entityType: resource.type,
        tenantId: msg.tenantId,
        changes: msg.changes || [],
        action: msg.action,
        category: msg.category || null,
        resource: resource, // Use our explicitly mapped resource object
        context: msg.context || {},
        metadata: msg.metadata || {},
      };

      // Final debug log of what we're sending to the service
      this.logger.debug(
        `Sending to ingestion service: ${JSON.stringify({
          eventId: auditLogData.eventId,
          resource: auditLogData.resource,
          tenantId: auditLogData.tenantId,
          action: auditLogData.action,
        })}`
      );

      // Ingest the audit log
      await this.auditLogIngestionService.ingest(auditLogData);

      this.logger.log("Audit log event đã được xử lý thành công");
    } catch (error) {
      this.logger.error(
        `Error processing audit log event: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
