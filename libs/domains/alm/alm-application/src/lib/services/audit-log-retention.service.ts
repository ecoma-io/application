import { ICommandBus, UnauthorizedError } from '@ecoma/common-application';
import { RetentionPolicy } from '@ecoma/alm-domain';
import { ApplyRetentionPolicyCommand } from '../commands/apply-retention-policy.command';
import { IAuthorizationService } from '../interfaces/iam/authorization.service';

/**
 * Service quản lý chính sách retention cho audit logs
 * @class
 */
export class AuditLogRetentionService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly authorizationService: IAuthorizationService,
  ) {}

  /**
   * Áp dụng một chính sách retention
   * @param policy Chính sách retention cần áp dụng
   * @param userId ID của người dùng thực hiện hành động
   * @param dryRun Chế độ thử nghiệm, không thực sự xóa dữ liệu
   * @throws UnauthorizedError nếu người dùng không có quyền quản lý retention
   */
  async applyRetentionPolicy(
    policy: RetentionPolicy,
    userId: string,
    dryRun = false,
  ): Promise<void> {
    // Kiểm tra quyền quản lý retention
    const hasAccess = await this.authorizationService.canManageRetentionPolicy(userId);
    if (!hasAccess) {
      throw new UnauthorizedError('Không có quyền quản lý retention policy');
    }

    // Tạo và gửi command
    const command = new ApplyRetentionPolicyCommand(policy, dryRun);
    await this.commandBus.execute(command);
  }
}
