import {
  ICommandHandler,
  IGenericResult,
  IQueryHandler,
} from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";

import { DeleteRetentionPolicyCommandDto } from "../dtos/commands/delete-retention-policy.command.dto";
import { RetentionPolicyQueryDto } from "../dtos/queries/retention-policy.query.dto";
import { RetentionPolicyMapper } from "../mappers";
import {
  IRetentionPolicyReadRepo,
  IRetentionPolicyWriteRepo,
} from "../ports/repository";
import {
  ActivateRetentionPolicyCommand,
  CreateRetentionPolicyCommand,
  DeactivateRetentionPolicyCommand,
  DeleteRetentionPolicyCommand,
  DeleteRetentionPolicyCommandHandler,
  UpdateRetentionPolicyCommand,
} from "../use-cases/commands";
import { GetRetentionPoliciesQuery } from "../use-cases/queries";

/**
 * Application Service cho quản lý Retention Policy.
 * Điều phối các thao tác CRUD, activate, deactivate policy, gọi handler, logging, kiểm tra policy/authorization.
 */
export class RetentionPolicyApplicationService {
  constructor(
    private readonly writeRepo: IRetentionPolicyWriteRepo,
    private readonly readRepo: IRetentionPolicyReadRepo,
    private readonly logger: ILogger,
    private readonly deactivateHandler: ICommandHandler<
      DeactivateRetentionPolicyCommand,
      IGenericResult<string, string>
    >,
    private readonly activateHandler: ICommandHandler<
      ActivateRetentionPolicyCommand,
      IGenericResult<string, string>
    >,
    private readonly createHandler: ICommandHandler<
      CreateRetentionPolicyCommand,
      IGenericResult<string, string>
    >,
    private readonly updateHandler: ICommandHandler<
      UpdateRetentionPolicyCommand,
      IGenericResult<string, string>
    >,
    private readonly deleteHandler: DeleteRetentionPolicyCommandHandler,
    private readonly getHandler: IQueryHandler<
      GetRetentionPoliciesQuery,
      IGenericResult<
        IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>,
        string
      >
    >
  ) {}

  /**
   * Tạo mới retention policy
   * @param command
   */
  async createRetentionPolicy(
    command: CreateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.info("Tạo retention policy");
    return this.createHandler.handle(command);
  }

  /**
   * Cập nhật retention policy
   * @param command
   */
  async updateRetentionPolicy(
    command: UpdateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.info("Cập nhật retention policy");
    return this.updateHandler.handle(command);
  }

  /**
   * Xóa retention policy
   * @param id ID policy
   */
  async deleteRetentionPolicy(
    id: string
  ): Promise<IGenericResult<string, string>> {
    this.logger.info("Xóa retention policy", { id });
    const dto: DeleteRetentionPolicyCommandDto = { id };
    const command = new DeleteRetentionPolicyCommand(dto);
    return this.deleteHandler.handle(command);
  }

  /**
   * Kích hoạt retention policy
   * @param command
   */
  async activateRetentionPolicy(
    command: ActivateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.info("Kích hoạt retention policy");
    return this.activateHandler.handle(command);
  }

  /**
   * Vô hiệu hóa retention policy
   * @param command
   */
  async deactivateRetentionPolicy(
    command: DeactivateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.info("Vô hiệu hóa retention policy");
    return this.deactivateHandler.handle(command);
  }

  /**
   * Lấy danh sách retention policy
   * @param query
   */
  async getRetentionPolicies(
    query: GetRetentionPoliciesQuery
  ): Promise<
    IGenericResult<IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>, string>
  > {
    this.logger.info("Lấy danh sách retention policy");
    return this.getHandler.handle(query);
  }

  /**
   * Lấy chi tiết retention policy
   * @param id ID policy
   */
  async getRetentionPolicyDetail(
    id: string
  ): Promise<RetentionPolicyQueryDto | null> {
    this.logger.info("Lấy chi tiết retention policy", { id });
    const policy = await this.readRepo.findById(id as any);
    if (!policy) return null;
    return RetentionPolicyMapper.toQueryDto(policy);
  }
}
