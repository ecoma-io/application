import { ICommandHandler, IGenericResult } from "@ecoma/common-application";
import { ILogger, UuidId } from "@ecoma/common-domain";
import { validateSync } from "class-validator";

import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { ActivateRetentionPolicyCommand } from "./activate-retention-policy.command";

/**
 * Handler cho lệnh kích hoạt Retention Policy.
 * Xử lý validate, kiểm tra policy/authorization (nếu cần), cập nhật trạng thái isActive, ghi log.
 * @see ActivateRetentionPolicyCommand
 */
export class ActivateRetentionPolicyCommandHandler
  implements
    ICommandHandler<
      ActivateRetentionPolicyCommand,
      IGenericResult<string, string>
    >
{
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyWriteRepo,
    private readonly logger: ILogger
  ) {}

  /**
   * Thực thi lệnh kích hoạt Retention Policy
   * @param command Lệnh kích hoạt policy
   */
  async handle(
    command: ActivateRetentionPolicyCommand
  ): Promise<IGenericResult<string, string>> {
    this.logger.debug("Bắt đầu xử lý ActivateRetentionPolicyCommand", {
      payload: command.payload,
    });
    // TODO: Kiểm tra policy/authorization
    // TODO: Ghi audit log
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
      await this.retentionPolicyRepo.update(
        command.payload.id as unknown as UuidId,
        { isActive: true }
      );
      this.logger.info("Kích hoạt retention policy thành công");
      return {
        success: true,
        error: "",
        details: "",
        data: command.payload.id,
      };
    } catch (e: any) {
      this.logger.error("Lỗi khi kích hoạt retention policy", e);
      return {
        success: false,
        error: "INTERNAL_ERROR",
        details: e?.message || "",
        data: "",
      };
    }
  }
}
