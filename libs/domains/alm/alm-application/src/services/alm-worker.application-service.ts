import { Injectable } from "@nestjs/common";
import {
  DeleteAuditLogsUseCase,
  ProcessRetentionPoliciesUseCase,
} from "../use-cases";

@Injectable()
export class AlmWorkerApplicationService {
  constructor(
    private readonly processRetentionPoliciesUseCase: ProcessRetentionPoliciesUseCase,
    private readonly deleteAuditLogsUseCase: DeleteAuditLogsUseCase
  ) {}

  async processRetentionPolicies(batchSize = 1000): Promise<{
    processedPolicies: number;
    totalEntriesQueued: number;
  }> {
    return this.processRetentionPoliciesUseCase.execute(batchSize);
  }

  async deleteAuditLogs(command: { auditLogIds: string[] }): Promise<number> {
    return this.deleteAuditLogsUseCase.execute(command);
  }
}
