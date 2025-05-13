import { IsOptional, IsUUID } from 'class-validator';
import { Maybe } from '@ecoma/common-types';

/**
 * DTO cho lệnh áp dụng chính sách lưu trữ
 */
export class ApplyRetentionPolicyCommandDto {
  /**
   * ID của chính sách lưu trữ cần áp dụng (tùy chọn)
   * Nếu không cung cấp, sẽ áp dụng tất cả các chính sách đang hoạt động
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID chính sách phải là UUID hợp lệ' })
  policyId?: Maybe<string>;
}
