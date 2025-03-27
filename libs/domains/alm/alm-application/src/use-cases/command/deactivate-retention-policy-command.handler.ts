import { RetentionPolicyId } from "@ecoma/alm-domain";
import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { DeactivateRetentionPolicyCommandDto } from "../../dto/deactivate-retention-policy-command.dto";
import {
  IRetentionPolicyReadRepository,
  IRetentionPolicyWriteRepository,
} from "../../ports";

export class DeactivateRetentionPolicyCommandHandler extends AbstractCommandUseCase<
  DeactivateRetentionPolicyCommandDto,
  GenericResult<void>
> {
  constructor(
    private readonly retentionPolicyReadRepo: IRetentionPolicyReadRepository,
    private readonly retentionPolicyWriteRepo: IRetentionPolicyWriteRepository,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(DeactivateRetentionPolicyCommandHandler.name);
  }

  protected override async handle(
    command: DeactivateRetentionPolicyCommandDto
  ): Promise<GenericResult<void>> {
    const logId = `deactivate-policy_${command.id}_${Date.now()}`;

    try {
      this.logger.info(`Deactivating retention policy [${logId}]`, {
        policyId: command.id,
      });

      const policy = await this.retentionPolicyReadRepo.findById(
        new RetentionPolicyId(command.id)
      );

      if (!policy) {
        this.logger.warn(`Policy not found for deactivation [${logId}]`, {
          policyId: command.id,
        });
        return { success: false, error: "Policy not found" };
      }

      this.logger.debug(`Found policy to deactivate [${logId}]`, {
        id: policy.id,
      });

      policy.deactivate();

      await this.retentionPolicyWriteRepo.save(policy);

      this.logger.info(`Retention policy deactivated successfully [${logId}]`);

      return { success: true };
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to deactivate retention policy [${logId}] - ${error.message}`
      );

      return {
        success: false,
        error: `Error deactivating retention policy: ${error.message}`,
      };
    }
  }
}
