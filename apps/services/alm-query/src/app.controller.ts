import {
  AlmQueryApplicationService,
  AuditLogQueryDto,
  RetentionPolicyQueryDto,
} from "@ecoma/alm-application";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";

@Controller()
export class AppController {
  constructor(
    private readonly almQueryApplicationService: AlmQueryApplicationService
  ) {}

  @MessagePattern("alm.audit-logs.query")
  async queryAuditLogs(payload: unknown) {
    // Chuyển đổi plain object từ NATS thành class instance
    const queryDto = plainToInstance(AuditLogQueryDto, payload);
    const result = await this.almQueryApplicationService.queryAuditLogs(
      queryDto
    );
    return { success: true, ...result };
  }

  @MessagePattern("alm.retention-policies.query")
  async queryRetentionPolicies(payload: unknown) {
    // Chuyển đổi plain object từ NATS thành class instance
    const queryDto = plainToInstance(RetentionPolicyQueryDto, payload);
    const result = await this.almQueryApplicationService.queryRetentionPolicies(
      queryDto
    );
    return { success: true, ...result };
  }
}
