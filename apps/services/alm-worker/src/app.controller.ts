import { AlmWorkerApplicationService } from "@ecoma/alm-application";
import { AbstractLogger } from "@ecoma/common-application";
import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(
    private readonly applicationService: AlmWorkerApplicationService,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(AppController.name);
  }

  @EventPattern("alm.retention.manual.trigger")
  async handleManualTrigger() {
    try {
      const result = await this.applicationService.processRetentionPolicies();

      this.logger.info("Manual retention started", {
        processedPolicies: result.processedPolicies,
        totalEntriesQueued: result.totalEntriesQueued,
      });

      return result;
    } catch (error) {
      this.logger.error(
        "Failed to process manual retention trigger",
        error as Error
      );
      throw error;
    }
  }
}
