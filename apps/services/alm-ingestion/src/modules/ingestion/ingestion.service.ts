import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IAuditLog, IAuditLogEvent } from "./interfaces/audit-log.interface";

/**
 * Service xử lý việc lưu trữ các sự kiện audit log
 * Service này lắng nghe các sự kiện từ RabbitMQ và lưu trữ chúng vào MongoDB
 */
@Injectable()
export class AuditLogIngestionService {
  private readonly logger = new Logger(AuditLogIngestionService.name);

  constructor(
    @InjectModel("AuditLog")
    private readonly auditLogModel: Model<IAuditLog>
  ) {}

  /**
   * Kiểm tra tính hợp lệ của sự kiện audit log
   * @param event - Sự kiện cần kiểm tra
   * @returns true nếu sự kiện hợp lệ, false nếu không hợp lệ
   */
  private validateEvent(event: unknown): event is IAuditLogEvent {
    if (!event || typeof event !== "object") {
      return false;
    }

    const eventObj = event as Record<string, unknown>;

    // Validate required fields
    if (
      !eventObj.timestamp ||
      !eventObj.initiator ||
      !eventObj.actionType ||
      !eventObj.status
    ) {
      return false;
    }

    // Validate initiator
    if (
      typeof eventObj.initiator !== "object" ||
      !eventObj.initiator ||
      typeof (eventObj.initiator as Record<string, unknown>).type !==
        "string" ||
      typeof (eventObj.initiator as Record<string, unknown>).name !== "string"
    ) {
      return false;
    }

    // Validate timestamp
    const timestamp = new Date(eventObj.timestamp as string | number | Date);
    if (isNaN(timestamp.getTime())) {
      return false;
    }

    // Validate status
    if (eventObj.status !== "Success" && eventObj.status !== "Failure") {
      return false;
    }

    return true;
  }

  /**
   * Xử lý sự kiện audit log nhận được từ RabbitMQ
   * Phương thức này sẽ:
   * 1. Kiểm tra tính hợp lệ của sự kiện
   * 2. Tạo bản ghi audit log mới
   * 3. Lưu bản ghi vào MongoDB
   *
   * @param event - Sự kiện audit log nhận được
   * @throws Error nếu có lỗi xảy ra trong quá trình xử lý
   */
  @RabbitSubscribe({
    exchange: "alm.events",
    routingKey: "alm.audit.log.requested",
    queue: "alm.audit-logs",
  })
  async handleAuditLogEvent(event: unknown) {
    try {
      this.logger.debug(`Received audit log event: ${JSON.stringify(event)}`);

      if (!this.validateEvent(event)) {
        this.logger.warn(
          `Invalid audit log event received: ${JSON.stringify(event)}`
        );
        return;
      }

      const auditLog = {
        id: uuidv4(),
        eventId: event.eventId,
        timestamp: new Date(event.timestamp),
        initiator: {
          type: event.initiator.type,
          id: event.initiator.id,
          name: event.initiator.name,
        },
        actionType: event.actionType,
        category: event.category,
        severity: event.severity,
        entityId: event.entityId,
        entityType: event.entityType,
        boundedContext: event.boundedContext,
        tenantId: event.tenantId,
        contextData: event.contextData || {},
        status: event.status,
        failureReason: event.failureReason,
        createdAt: new Date(),
      };

      await this.auditLogModel.create(auditLog);
      this.logger.debug(`Audit log created: ${JSON.stringify(auditLog)}`);
    } catch (error) {
      this.logger.error(
        `Error handling audit log event: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
