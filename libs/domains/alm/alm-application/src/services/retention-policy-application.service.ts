import { ILogger } from "@ecoma/common-domain";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { ActivateRetentionPolicyCommandDto } from "../dtos/commands/activate-retention-policy.command.dto";
import { CreateRetentionPolicyCommandDto } from "../dtos/commands/create-retention-policy.command.dto";
import { DeactivateRetentionPolicyCommandDto } from "../dtos/commands/deactivate-retention-policy.command.dto";
import { DeleteRetentionPolicyCommandDto } from "../dtos/commands/delete-retention-policy.command.dto";
import { UpdateRetentionPolicyCommandDto } from "../dtos/commands/update-retention-policy.command.dto";
import { RetentionPolicyMapper } from "../mappers";
import {
  IRetentionPolicyReadRepo,
  IRetentionPolicyWriteRepo,
} from "../ports/repository";
import {
  ActivateRetentionPolicyCommandHandler,
  CreateRetentionPolicyCommandHandler,
  DeactivateRetentionPolicyCommandHandler,
  DeleteRetentionPolicyCommandHandler,
  UpdateRetentionPolicyCommandHandler,
} from "../use-cases/commands";

/**
 * Application Service cho quản lý Retention Policy.
 * Điều phối các thao tác CRUD, activate, deactivate policy, gọi handler, logging, kiểm tra policy/authorization.
 */
export class RetentionPolicyApplicationService {
  constructor(
    private readonly writeRepo: IRetentionPolicyWriteRepo,
    private readonly readRepo: IRetentionPolicyReadRepo,
    private readonly logger: ILogger,
    private readonly deactivateHandler: DeactivateRetentionPolicyCommandHandler,
    private readonly activateHandler: ActivateRetentionPolicyCommandHandler,
    private readonly createHandler: CreateRetentionPolicyCommandHandler,
    private readonly updateHandler: UpdateRetentionPolicyCommandHandler,
    private readonly deleteHandler: DeleteRetentionPolicyCommandHandler
  ) {}

  /**
   * Tạo mới retention policy
   * @param dto Dữ liệu policy
   */
  async createRetentionPolicy(
    dto: CreateRetentionPolicyCommandDto
  ): Promise<any> {
    this.logger.info("Tạo retention policy", { dto });

    // Use plainToInstance to ensure DTO is correctly instantiated for validation
    const dtoInstance = plainToInstance(CreateRetentionPolicyCommandDto, dto);

    const errors = validateSync(dtoInstance, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      this.logger.warn("Payload tạo retention policy không hợp lệ", { errors });
      return {
        success: false,
        error: "INVALID_PAYLOAD",
        details: errors
          .map((e) => Object.values(e.constraints || {}).join(", "))
          .join("; "),
        data: "",
      };
    }
    const command = { payload: dto };
    return this.createHandler.execute(command as any);
  }

  /**
   * Cập nhật retention policy
   * @param id ID policy
   * @param dto Dữ liệu cập nhật
   */
  async updateRetentionPolicy(
    id: string,
    dto: UpdateRetentionPolicyCommandDto
  ): Promise<any> {
    this.logger.info("Cập nhật retention policy", { id, dto });

    // Use plainToInstance to ensure DTO is correctly instantiated for validation
    const dtoInstance = plainToInstance(UpdateRetentionPolicyCommandDto, dto);

    const errors = validateSync(dtoInstance, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      this.logger.warn("Payload cập nhật retention policy không hợp lệ", {
        errors,
      });
      return {
        success: false,
        error: "INVALID_PAYLOAD",
        details: errors
          .map((e) => Object.values(e.constraints || {}).join(", "))
          .join("; "),
        data: "",
      };
    }
    const command = { payload: dto };
    return this.updateHandler.execute(command as any);
  }

  /**
   * Xóa retention policy
   * @param id ID policy
   */
  async deleteRetentionPolicy(id: string): Promise<any> {
    this.logger.info("Xóa retention policy", { id });
    const dto: DeleteRetentionPolicyCommandDto = { id };
    const command = { payload: dto };
    return this.deleteHandler.execute(command as any);
  }

  /**
   * Kích hoạt retention policy
   * @param id ID policy
   */
  async activateRetentionPolicy(id: string): Promise<any> {
    this.logger.info("Kích hoạt retention policy", { id });
    const dto: ActivateRetentionPolicyCommandDto = { id };
    const command = { payload: dto };
    return this.activateHandler.execute(command as any);
  }

  /**
   * Vô hiệu hóa retention policy
   * @param id ID policy
   */
  async deactivateRetentionPolicy(id: string): Promise<any> {
    this.logger.info("Vô hiệu hóa retention policy", { id });
    const dto: DeactivateRetentionPolicyCommandDto = { id };
    const command = { payload: dto };
    return this.deactivateHandler.execute(command as any);
  }

  /**
   * Lấy danh sách retention policy
   */
  async getRetentionPolicies(): Promise<any[]> {
    this.logger.info("Lấy danh sách retention policy");
    const policies = await this.readRepo.findActive();
    return policies.map(RetentionPolicyMapper.toQueryDto);
  }

  /**
   * Lấy chi tiết retention policy
   * @param id ID policy
   */
  async getRetentionPolicyDetail(id: string): Promise<any> {
    this.logger.info("Lấy chi tiết retention policy", { id });
    const policy = await this.readRepo.findById(id as any);
    if (!policy) return null;
    return RetentionPolicyMapper.toQueryDto(policy);
  }
}
