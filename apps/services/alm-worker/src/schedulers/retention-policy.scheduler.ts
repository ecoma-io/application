import {
  AlmWorkerApplicationService,
  IDistributedLockService,
} from "@ecoma/alm-application";
import { AbstractLogger } from "@ecoma/common-application";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class RetentionPolicyScheduler {
  private readonly lockTimeoutMs: number;
  private readonly batchSize: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject("IDistributedLockService")
    private readonly lockService: IDistributedLockService,
    private readonly applicationService: AlmWorkerApplicationService,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(RetentionPolicyScheduler.name);

    this.lockTimeoutMs = this.configService.get<number>(
      "app.worker.scheduler.lockTimeoutMs",
      15 * 60 * 1000
    );
    this.batchSize = this.configService.get<number>(
      "app.worker.scheduler.batchSize",
      1000
    );

    this.logger.info(`Scheduler configured with batchSize: ${this.batchSize}`);
  }

  @Cron("0 */10 * * * *") // Chạy mỗi 10 phút
  async handleScheduledRetentionJob() {
    const lockName = "retention-policy-scheduler";

    try {
      // Cố gắng lấy khóa
      const acquired = await this.lockService.acquireLock(
        lockName,
        this.lockTimeoutMs
      );

      if (!acquired) {
        this.logger.debug(
          "Another instance is running the retention job. Skipping."
        );
        return;
      }

      this.logger.info("Starting retention policy processing");

      // Gọi application service để xử lý
      const result = await this.applicationService.processRetentionPolicies(
        this.batchSize
      );

      this.logger.info(
        `Retention processing complete: Processed ${result.processedPolicies} policies, ` +
          `queued ${result.totalEntriesQueued} entries for deletion`
      );
    } catch (error) {
      this.logger.error(
        `Failed to process retention policies: ${error.message}`
      );
    } finally {
      try {
        // Luôn giải phóng khóa
        await this.lockService.releaseLock(lockName);
      } catch (error) {
        this.logger.error(`Failed to release lock: ${error.message}`);
      }
    }
  }
}
