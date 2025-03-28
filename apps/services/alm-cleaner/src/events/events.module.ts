/**
 * @fileoverview Module xử lý các events trong ALM Cleaner Service
 * @since 1.0.0
 */

import { ALM_TOKENS, AlmInfrastructureModule, AuditLogMongoRepository } from "@ecoma/alm-infrastructure";
import { Module } from "@nestjs/common";
import { CleanupSchedulerHandler } from "./handlers/cleanup-scheduler.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { ScheduleModule } from "@nestjs/schedule";

const eventHandlers = [CleanupSchedulerHandler];

@Module({
  imports: [
    AlmInfrastructureModule.registerAsync(),
    CqrsModule,
    ScheduleModule,
  ],
  providers: [
    ...eventHandlers,
    {
      provide: AuditLogMongoRepository,
      useFactory: (repository) => repository,
      inject: [ALM_TOKENS.auditLogWriteRepository],
    },
  ],
  exports: [...eventHandlers],
})
export class EventsModule {} 