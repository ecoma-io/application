import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { RetentionPolicyDto } from "../../dto";
import { RetentionPolicyFactory } from "../../factories";
import { IRetentionPolicyWriteRepository } from "../../ports";

export class CreateRetentionPolicyCommandHandler extends AbstractCommandUseCase<
  RetentionPolicyDto,
  GenericResult<void>
> {
  constructor(
    private readonly retentionPolicyWriteRepo: IRetentionPolicyWriteRepository,
    private readonly retentionPolicyFactory: RetentionPolicyFactory,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(CreateRetentionPolicyCommandHandler.name);
  }

  protected override async handle(
    command: RetentionPolicyDto
  ): Promise<GenericResult<void>> {
    const logId = `create-policy_${command.name}_${Date.now()}`;

    try {
      this.logger.info(`Creating retention policy [${logId}]`, {
        name: command.name,
        boundedContext: command.boundedContext,
        entityType: command.entityType,
      });

      this.logger.debug(`Creating policy details [${logId}]`, {
        actionType: command.actionType,
        tenantId: command.tenantId,
        retentionDays: command.retentionDays,
        isActive: command.isActive,
      });

      const policy = this.retentionPolicyFactory.create({
        name: command.name,
        description: command.description,
        boundedContext: command.boundedContext,
        actionType: command.actionType,
        entityType: command.entityType,
        tenantId: command.tenantId,
        retentionDays: command.retentionDays,
        isActive: command.isActive,
        createdAt: new Date(),
      });

      this.logger.debug(`Policy domain model created [${logId}]`, {
        id: policy.id,
      });

      await this.retentionPolicyWriteRepo.save(policy);

      this.logger.info(`Retention policy created successfully [${logId}]`, {
        id: policy.id,
      });

      return { success: true };
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to create retention policy [${logId}] - ${error.message}`
      );

      this.logger.debug(`Error details for [${logId}]`, { stack: error.stack });

      return {
        success: false,
        error: `Error creating retention policy: ${error.message}`,
      };
    }
  }
}
