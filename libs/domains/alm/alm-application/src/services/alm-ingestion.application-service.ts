import { ActivateRetentionPolicyCommandDto } from "../dto/activate-retention-policy-command.dto";
import { DeactivateRetentionPolicyCommandDto } from "../dto/deactivate-retention-policy-command.dto";
import { DeleteRetentionPolicyCommandDto } from "../dto/delete-retention-policy-command.dto";
import { IngestAuditLogDto } from "../dto/ingest-audit-log.dto";
import { RetentionPolicyDto } from "../dto/retention-policy.dto";
import { UpdateRetentionPolicyCommandDto } from "../dto/update-retention-policy-command.dto";
import {
  ActivateRetentionPolicyCommandHandler,
  CreateRetentionPolicyCommandHandler,
  DeactivateRetentionPolicyCommandHandler,
  DeleteRetentionPolicyCommandHandler,
  IngestAuditLogCommandHandler,
  UpdateRetentionPolicyCommandHandler,
} from "../use-cases";

export class AlmIngestionApplicationService {
  constructor(
    private readonly ingestAuditLogCommandHandler: IngestAuditLogCommandHandler,
    private readonly createRetentionPolicyCommandHandler: CreateRetentionPolicyCommandHandler,
    private readonly deleteRetentionPolicyCommandHandler: DeleteRetentionPolicyCommandHandler,
    private readonly updateRetentionPolicyCommandHandler: UpdateRetentionPolicyCommandHandler,
    private readonly activateRetentionPolicyCommandHandler: ActivateRetentionPolicyCommandHandler,
    private readonly deactivateRetentionPolicyCommandHandler: DeactivateRetentionPolicyCommandHandler
  ) {}

  async persistAuditLogEntry(dto: IngestAuditLogDto): Promise<void> {
    await this.ingestAuditLogCommandHandler.execute(dto);
  }

  async createRetentionPolicy(dto: RetentionPolicyDto): Promise<void> {
    await this.createRetentionPolicyCommandHandler.execute(dto);
  }

  async deleteRetentionPolicy(
    dto: DeleteRetentionPolicyCommandDto
  ): Promise<void> {
    await this.deleteRetentionPolicyCommandHandler.execute(dto);
  }

  async updateRetentionPolicy(
    dto: UpdateRetentionPolicyCommandDto
  ): Promise<void> {
    await this.updateRetentionPolicyCommandHandler.execute(dto);
  }

  async activateRetentionPolicy(
    dto: ActivateRetentionPolicyCommandDto
  ): Promise<void> {
    await this.activateRetentionPolicyCommandHandler.execute(dto);
  }

  async deactivateRetentionPolicy(
    dto: DeactivateRetentionPolicyCommandDto
  ): Promise<void> {
    await this.deactivateRetentionPolicyCommandHandler.execute(dto);
  }
}
