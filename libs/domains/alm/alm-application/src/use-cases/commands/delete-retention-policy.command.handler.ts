import { ICommandHandler, IGenericResult } from "@ecoma/common-application";
import { ILogger, UuidId } from "@ecoma/common-domain";
import { validateSync } from "class-validator";

import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { DeleteRetentionPolicyCommand } from "./delete-retention-policy.command";

export class DeleteRetentionPolicyCommandHandler
  implements
    ICommandHandler<
      DeleteRetentionPolicyCommand,
      IGenericResult<string, string>
    >
{
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyWriteRepo,
    private readonly logger: ILogger
  ) {}

  async handle(
    command: DeleteRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.debug("Bắt đầu xử lý DeleteRetentionPolicyCommand", {
      payload: command.payload,
    });
    const errors = validateSync(command.payload, {
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
      await this.retentionPolicyRepo.delete(
        command.payload.id as unknown as UuidId
      );
      this.logger.info("Xóa retention policy thành công");
      return {
        success: true,
        error: "",
        details: "",
        data: command.payload.id,
      };
    } catch (e: any) {
      this.logger.error("Lỗi khi xóa retention policy", e);
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
