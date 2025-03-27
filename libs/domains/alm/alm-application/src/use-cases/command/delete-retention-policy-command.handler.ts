import { RetentionPolicyId } from "@ecoma/alm-domain";
import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { DeleteRetentionPolicyCommandDto } from "../../dto";
import {
  IRetentionPolicyReadRepository,
  IRetentionPolicyWriteRepository,
} from "../../ports";

export class DeleteRetentionPolicyCommandHandler extends AbstractCommandUseCase<
  DeleteRetentionPolicyCommandDto,
  GenericResult<void>
> {
  constructor(
    private readonly retentionPolicyReadRepo: IRetentionPolicyReadRepository,
    private readonly retentionPolicyWriteRepo: IRetentionPolicyWriteRepository,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(DeleteRetentionPolicyCommandHandler.name);
  }

  protected override async handle(
    command: DeleteRetentionPolicyCommandDto
  ): Promise<GenericResult<void>> {
    const logId = `delete-policy_${command.id}_${Date.now()}`;

    try {
      this.logger.info(`Deleting retention policy [${logId}]`, {
        policyId: command.id,
      });

      const policy = await this.retentionPolicyReadRepo.findById(
        new RetentionPolicyId(command.id)
      );

      if (!policy) {
        this.logger.warn(`Policy not found for deletion [${logId}]`, {
          policyId: command.id,
        });
        return { success: false, error: "Policy not found" };
      }

      this.logger.debug(`Found policy to delete [${logId}]`, { id: policy.id });

      await this.retentionPolicyWriteRepo.delete(policy.id);

      this.logger.info(`Retention policy deleted successfully [${logId}]`);

      return { success: true };
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to delete retention policy [${logId}] - ${error.message}`
      );

      return {
        success: false,
        error: `Error deleting retention policy: ${error.message}`,
      };
    }
  }
}
