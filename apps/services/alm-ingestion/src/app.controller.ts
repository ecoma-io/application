import {
  ActivateRetentionPolicyCommandDto,
  AlmIngestionApplicationService,
  DeactivateRetentionPolicyCommandDto,
  DeleteRetentionPolicyCommandDto,
  IngestAuditLogDto,
  RetentionPolicyDto,
  UpdateRetentionPolicyCommandDto,
} from "@ecoma/alm-application";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";

@Controller()
export class AppController {
  constructor(
    private readonly almIngestionApplicationService: AlmIngestionApplicationService
  ) {}

  @MessagePattern("alm.audit-log.create")
  async ingestAuditLog(payload: unknown) {
    // Chuyển đổi plain object từ NATS thành class instance
    const auditLogDto = plainToInstance(IngestAuditLogDto, payload);
    await this.almIngestionApplicationService.persistAuditLogEntry(auditLogDto);
    return { success: true };
  }

  @MessagePattern("alm.retention-policy.create")
  async createRetentionPolicy(payload: unknown) {
    const policyDto = plainToInstance(RetentionPolicyDto, payload);
    await this.almIngestionApplicationService.createRetentionPolicy(policyDto);
    return { success: true };
  }

  @MessagePattern("alm.retention-policy.update")
  async updateRetentionPolicy(payload: unknown) {
    const updateDto = plainToInstance(UpdateRetentionPolicyCommandDto, payload);
    await this.almIngestionApplicationService.updateRetentionPolicy(updateDto);
    return { success: true };
  }

  @MessagePattern("alm.retention-policy.delete")
  async deleteRetentionPolicy(payload: unknown) {
    const deleteDto = plainToInstance(DeleteRetentionPolicyCommandDto, payload);
    await this.almIngestionApplicationService.deleteRetentionPolicy(deleteDto);
    return { success: true };
  }

  @MessagePattern("alm.retention-policy.activate")
  async activateRetentionPolicy(payload: unknown) {
    const activateDto = plainToInstance(
      ActivateRetentionPolicyCommandDto,
      payload
    );
    await this.almIngestionApplicationService.activateRetentionPolicy(
      activateDto
    );
    return { success: true };
  }

  @MessagePattern("alm.retention-policy.deactivate")
  async deactivateRetentionPolicy(payload: unknown) {
    const deactivateDto = plainToInstance(
      DeactivateRetentionPolicyCommandDto,
      payload
    );
    await this.almIngestionApplicationService.deactivateRetentionPolicy(
      deactivateDto
    );
    return { success: true };
  }
}
