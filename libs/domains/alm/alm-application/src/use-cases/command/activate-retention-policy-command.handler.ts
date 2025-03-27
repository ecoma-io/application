import { RetentionPolicyId } from "@ecoma/alm-domain";
import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { ActivateRetentionPolicyCommandDto } from "../../dto/activate-retention-policy-command.dto";
import {
  IRetentionPolicyReadRepository,
  IRetentionPolicyWriteRepository,
} from "../../ports";

export class ActivateRetentionPolicyCommandHandler extends AbstractCommandUseCase<
  ActivateRetentionPolicyCommandDto,
  GenericResult<void>
> {
  constructor(
    private readonly retentionPolicyReadRepo: IRetentionPolicyReadRepository,
    private readonly retentionPolicyWriteRepo: IRetentionPolicyWriteRepository,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(ActivateRetentionPolicyCommandHandler.name);
  }

  protected override async handle(
    command: ActivateRetentionPolicyCommandDto
  ): Promise<GenericResult<void>> {
    const logId = `activate-policy_${command.id}_${Date.now()}`;

    try {
      this.logger.info(`Activating retention policy [${logId}]`, {
        policyId: command.id,
      });

      const policy = await this.retentionPolicyReadRepo.findById(
        new RetentionPolicyId(command.id)
      );

      if (!policy) {
        this.logger.warn(`Policy not found for activation [${logId}]`, {
          policyId: command.id,
        });
        return { success: false, error: "Policy not found" };
      }

      this.logger.debug(`Found policy to activate [${logId}]`, {
        id: policy.id,
      });

      policy.activate();

      await this.retentionPolicyWriteRepo.save(policy);

      this.logger.info(`Retention policy activated successfully [${logId}]`);

      return { success: true };
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to activate retention policy [${logId}] - ${error.message}`
      );

      return {
        success: false,
        error: `Error activating retention policy: ${error.message}`,
      };
    }
  }
}
