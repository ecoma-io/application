import { RetentionPolicyId } from "@ecoma/alm-domain";
import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { UpdateRetentionPolicyCommandDto } from "../../dto/update-retention-policy-command.dto";
import { RetentionPolicyFactory } from "../../factories";
import {
  IRetentionPolicyReadRepository,
  IRetentionPolicyWriteRepository,
} from "../../ports";

export class UpdateRetentionPolicyCommandHandler extends AbstractCommandUseCase<
  UpdateRetentionPolicyCommandDto,
  GenericResult<void>
> {
  constructor(
    private readonly retentionPolicyReadRepo: IRetentionPolicyReadRepository,
    private readonly retentionPolicyWriteRepo: IRetentionPolicyWriteRepository,
    private readonly retentionPolicyFactory: RetentionPolicyFactory,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(UpdateRetentionPolicyCommandHandler.name);
  }

  protected override async handle(
    command: UpdateRetentionPolicyCommandDto
  ): Promise<GenericResult<void>> {
    const logId = `update-policy_${command.id}_${Date.now()}`;

    try {
      this.logger.info(`Updating retention policy [${logId}]`, {
        policyId: command.id,
        name: command.name,
        boundedContext: command.boundedContext,
        entityType: command.entityType,
      });

      const policy = await this.retentionPolicyReadRepo.findById(
        new RetentionPolicyId(command.id)
      );

      if (!policy) {
        this.logger.warn(`Policy not found [${logId}]`, {
          policyId: command.id,
        });
        return { success: false, error: "Policy not found" };
      }

      this.logger.debug(`Found policy to update [${logId}]`, { id: policy.id });

      policy.update(
        command.name,
        command.description,
        command.boundedContext,
        command.actionType,
        command.entityType,
        command.tenantId,
        command.retentionDays
      );

      await this.retentionPolicyWriteRepo.save(policy);

      this.logger.info(`Retention policy updated successfully [${logId}]`);

      return { success: true };
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to update retention policy [${logId}] - ${error.message}`
      );

      this.logger.debug(`Error details for [${logId}]`, { stack: error.stack });

      return {
        success: false,
        error: `Error updating retention policy: ${error.message}`,
      };
    }
  }
}
