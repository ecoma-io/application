import { IGenericResult } from "@ecoma/common-application";
import { ILogger } from "@ecoma/common-domain";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { CreateRetentionPolicyCommandDto } from "../../dtos/commands/create-retention-policy.command.dto";
import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { CreateRetentionPolicyCommand } from "./create-retention-policy.command";

export class CreateRetentionPolicyCommandHandler {
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyWriteRepo,
    private readonly logger: ILogger
  ) {}

  async execute(
    command: CreateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.debug("Bắt đầu xử lý CreateRetentionPolicyCommand", {
      payload: command.payload,
    });

    // Convert plain object to class instance to enable class-validator decorators
    const dto = plainToInstance(
      CreateRetentionPolicyCommandDto,
      command.payload
    );

    const errors = validateSync(dto, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      this.logger.warn("Dữ liệu không hợp lệ", { errors });
      return {
        success: false,
        error: "VALIDATION_ERROR",
        details: JSON.stringify(errors),
        data: "",
      };
    }

    try {
      // TODO: mapping sang domain object
      await this.retentionPolicyRepo.save(command.payload as any);
      this.logger.info("Tạo retention policy thành công");
      return {
        success: true,
        error: "",
        details: "",
        data: "",
      };
    } catch (e: any) {
      this.logger.error("Lỗi khi tạo retention policy", e);
      return {
        success: false,
        error: "INTERNAL_ERROR",
        details: e?.message || "",
        data: "",
      };
    }
  }
}
// TODO: Unit test cho handler này
