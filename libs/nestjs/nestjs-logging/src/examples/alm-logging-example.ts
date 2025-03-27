/**
 * @fileoverview Ví dụ về cách sử dụng nestjs-logging trong ALM module
 * @since 1.0.0
 * @example Đây là ví dụ để tham khảo, không triển khai trực tiếp
 */

import { ILogger } from "@ecoma/common-application";
import { Inject, Injectable, Module } from "@nestjs/common";
import { ApplicationLoggerAdapter } from "../lib/adapters/application-logger.adapter";
import { NestjsLogger } from "../lib/nestjs-logger";
import { NestjsLoggerModule } from "../lib/nestjs-logger.module";

// Token dùng để inject Application Logger
export const ALM_APPLICATION_LOGGER = "ALM_APPLICATION_LOGGER";

/**
 * Service triển khai trong tầng application
 */
@Injectable()
export class AuditLogApplicationService {
  constructor(@Inject(ALM_APPLICATION_LOGGER) private logger: ILogger) {}

  async processAuditLog(auditLogData: unknown): Promise<void> {
    this.logger.debug("Bắt đầu xử lý audit log");

    try {
      // Xử lý application logic
      this.logger.info("Đã xử lý audit log thành công", { data: auditLogData });
    } catch (error) {
      this.logger.error(
        "Lỗi khi xử lý audit log",
        error instanceof Error ? error : new Error(String(error)),
        { data: auditLogData }
      );
      throw error;
    }
  }
}

/**
 * Repository triển khai trong tầng infrastructure
 */
@Injectable()
export class AuditLogRepository {
  constructor(private readonly logger: NestjsLogger) {
    this.logger.setContext("AuditLogRepository");
  }

  async save(auditLog: any): Promise<void> {
    this.logger.debug(`Lưu audit log với ID: ${auditLog.id}`);

    try {
      // Lưu vào database
      this.logger.info(`Audit log đã được lưu thành công: ${auditLog.id}`);
    } catch (error) {
      this.logger.error(`Lỗi khi lưu audit log: ${auditLog.id}`, error);
      throw error;
    }
  }
}

/**
 * Module ALM Audit Log
 * Cấu hình cho việc sử dụng logger
 */
@Module({
  imports: [
    NestjsLoggerModule.register({
      defaultContext: "ALM",
      isGlobal: true,
    }),
  ],
  providers: [
    // Triển khai Logger cho application layer
    {
      provide: ALM_APPLICATION_LOGGER,
      useFactory: (nestjsLogger: NestjsLogger) => {
        return new ApplicationLoggerAdapter(nestjsLogger, "ALM-Application");
      },
      inject: [NestjsLogger],
    },
    // Service sử dụng logger
    AuditLogApplicationService,
    AuditLogRepository,
  ],
  exports: [
    ALM_APPLICATION_LOGGER,
    AuditLogApplicationService,
    AuditLogRepository,
  ],
})
export class AlmAuditLogModule {}
