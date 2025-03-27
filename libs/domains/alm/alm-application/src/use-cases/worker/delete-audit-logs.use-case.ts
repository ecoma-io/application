import { AuditLogEntryId } from "@ecoma/alm-domain";
import { AbstractLogger } from "@ecoma/common-application";
import { Injectable } from "@nestjs/common";
import { IAuditLogWriteRepository } from "../../ports";

@Injectable()
export class DeleteAuditLogsUseCase {
  constructor(
    private readonly auditLogRepo: IAuditLogWriteRepository,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(DeleteAuditLogsUseCase.name);
  }

  async execute(command: { auditLogIds: string[] }): Promise<number> {
    const { auditLogIds } = command;

    try {
      // Chuyển đổi string IDs thành AuditLogEntryId objects
      const ids = auditLogIds.map((id) => new AuditLogEntryId(id));

      // Xóa các entries
      await this.auditLogRepo.deleteMany(ids);

      this.logger.info(`Deleted ${ids.length} audit log entries`);

      return ids.length;
    } catch (error) {
      this.logger.error(`Failed to delete audit log entries`, error as Error);
      throw error; // Re-throw để message broker xử lý retry
    }
  }
}
