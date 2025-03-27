import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { PersistAuditLogHandler } from "./commands/handlers/persist-audit-log.handler";
import { AuditLogHandler } from "./handlers/audit-log.handler";
import { GetAuditLogsHandler } from "./queries/handlers/get-audit-logs.handler";
import { AuditLog, AuditLogSchema } from "./schemas/audit-log.schema";

const commandHandlers = [PersistAuditLogHandler];
const queryHandlers = [GetAuditLogsHandler];
const eventHandlers = [AuditLogHandler];

/**
 * Module quản lý audit log
 */
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers],
  exports: [],
})
export class AuditLogModule {}
