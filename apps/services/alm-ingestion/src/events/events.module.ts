/**
 * @fileoverview Module xử lý events cho ALM Ingestion Service
 * @since 1.0.0
 */

import { AuditLogIngestionService } from "@ecoma/alm-domain";
import { ALM_TOKENS, AlmInfrastructureModule } from "@ecoma/alm-infrastructure";
import { Module } from "@nestjs/common";
import { EventHandlers } from "./handlers";

@Module({
  imports: [
    // Import AlmInfrastructureModule để có thể inject IAuditLogWriteRepository
    AlmInfrastructureModule.registerAsync(),
  ],
  providers: [
    // Đăng ký tất cả các event handlers
    ...EventHandlers,

    // Đăng ký AuditLogIngestionService
    {
      provide: AuditLogIngestionService,
      useFactory: (auditLogWriteRepository) => {
        return new AuditLogIngestionService(auditLogWriteRepository);
      },
      inject: [ALM_TOKENS.auditLogWriteRepository],
    },
  ],
})
export class EventsModule {}
