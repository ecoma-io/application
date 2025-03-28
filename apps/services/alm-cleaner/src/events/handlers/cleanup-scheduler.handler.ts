/**
 * @fileoverview Handler xử lý việc xóa audit logs cũ theo lịch trình
 * @since 1.0.0
 */

import { NestjsLogger } from "@ecoma/nestjs-logging";
import { AuditLogMongoRepository } from "@ecoma/alm-infrastructure";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MessagePattern } from "@nestjs/microservices";

@Injectable()
export class CleanupSchedulerHandler implements OnModuleInit {
  private readonly logger = new NestjsLogger(CleanupSchedulerHandler.name);
  private retentionDays: number;

  constructor(
    private readonly auditLogRepository: AuditLogMongoRepository,
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus
  ) {
    this.retentionDays = this.configService.get<number>("RETENTION_DAYS", 90);
    this.logger.info(`Configured audit logs retention period: ${this.retentionDays} days`);
  }

  async onModuleInit() {
    this.logger.info("Initializing Cleanup Scheduler Handler");
    
    // Thực hiện dọn dẹp ngay khi khởi động nếu cần thiết
    try {
      await this.cleanupOldAuditLogs();
    } catch (error) {
      this.logger.error("Error executing cleanup on initialization", error);
    }
  }

  /**
   * Thực hiện dọn dẹp audit logs cũ vào lúc nửa đêm mỗi ngày
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledCleanup() {
    this.logger.info("Starting scheduled audit logs cleanup");
    try {
      await this.cleanupOldAuditLogs();
    } catch (error) {
      this.logger.error("Error executing scheduled cleanup", error);
    }
  }

  /**
   * Thực hiện dọn dẹp audit logs theo yêu cầu từ bên ngoài
   * @returns Kết quả dọn dẹp
   */
  @MessagePattern({ cmd: "cleanup-audit-logs" })
  async handleCleanupRequest() {
    this.logger.info("Received external request to cleanup audit logs");
    try {
      const result = await this.cleanupOldAuditLogs();
      return { success: true, deletedCount: result.deletedCount };
    } catch (error: unknown) {
      this.logger.error("Error processing external cleanup request", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Thực hiện dọn dẹp audit logs cũ dựa trên cấu hình thời gian giữ
   */
  private async cleanupOldAuditLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    
    this.logger.info(`Cleaning up audit logs older than ${this.retentionDays} days (before ${cutoffDate.toISOString()})`);
    
    try {
      const result = await this.auditLogRepository.deleteAuditLogsBefore(cutoffDate);
      this.logger.info(`Deleted ${result.deletedCount} old audit logs`);
      return result;
    } catch (error: unknown) {
      this.logger.error("Error deleting old audit logs", error);
      throw error;
    }
  }
} 