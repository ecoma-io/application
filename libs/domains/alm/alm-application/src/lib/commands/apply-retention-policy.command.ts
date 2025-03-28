/**
 * @fileoverview Command để áp dụng chính sách lưu trữ
 * @since 1.0.0
 */

import { ICommand } from '@ecoma/common-application';
import { RetentionPolicy } from '@ecoma/alm-domain';

/**
 * Command để áp dụng chính sách lưu trữ
 */
export class ApplyRetentionPolicyCommand implements ICommand {
  /** Version của command */
  public readonly version = '1.0.0';

  /**
   * Khởi tạo một instance của ApplyRetentionPolicyCommand
   * @param {RetentionPolicy} policy - Chính sách lưu trữ cần áp dụng
   * @param {boolean} [dryRun=false] - Chỉ kiểm tra mà không thực hiện xóa
   */
  constructor(
    public readonly policy: RetentionPolicy,
    public readonly dryRun = false
  ) {}
}
