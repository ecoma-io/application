import { IsBoolean, IsOptional } from 'class-validator';
import { Maybe } from '@ecoma/common-types';

/**
 * DTO cho truy vấn lấy danh sách chính sách lưu trữ
 */
export class GetRetentionPoliciesQueryDto {
  /**
   * Lọc theo trạng thái hoạt động (tùy chọn)
   * Nếu không chỉ định, lấy tất cả chính sách
   */
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: Maybe<boolean>;
}
