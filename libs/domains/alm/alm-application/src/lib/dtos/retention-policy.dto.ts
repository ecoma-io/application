import { Maybe } from '@ecoma/common-types';
import { IsString, IsOptional, IsInt, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO đại diện cho một quy tắc lưu trữ
 */
export class RetentionRuleDto {
  /**
   * Áp dụng cho BC cụ thể (tuỳ chọn)
   */
  @IsOptional()
  @IsString({ message: 'BoundedContext phải là chuỗi' })
  boundedContext?: Maybe<string>;

  /**
   * Áp dụng cho loại hành động cụ thể (tuỳ chọn)
   */
  @IsOptional()
  @IsString({ message: 'ActionType phải là chuỗi' })
  actionType?: Maybe<string>;

  /**
   * Áp dụng cho loại thực thể cụ thể (tuỳ chọn)
   */
  @IsOptional()
  @IsString({ message: 'EntityType phải là chuỗi' })
  entityType?: Maybe<string>;

  /**
   * Áp dụng cho Tenant cụ thể (tuỳ chọn)
   */
  @IsOptional()
  @IsString({ message: 'TenantId phải là chuỗi' })
  tenantId?: Maybe<string>;

  /**
   * Thời gian lưu trữ (số ngày)
   */
  @IsNotEmpty({ message: 'Thời gian lưu trữ không được để trống' })
  @IsInt({ message: 'Thời gian lưu trữ phải là số nguyên' })
  retentionDuration!: number;
}

/**
 * DTO đại diện cho chính sách lưu trữ dữ liệu
 */
export class RetentionPolicyDto {
  /**
   * ID của chính sách (nếu đã được lưu trữ)
   */
  @IsOptional()
  @IsString({ message: 'ID chính sách phải là chuỗi' })
  id?: Maybe<string>;

  /**
   * Tên chính sách
   */
  @IsNotEmpty({ message: 'Tên chính sách không được để trống' })
  @IsString({ message: 'Tên chính sách phải là chuỗi' })
  name!: string;

  /**
   * Mô tả chính sách
   */
  @IsNotEmpty({ message: 'Mô tả chính sách không được để trống' })
  @IsString({ message: 'Mô tả chính sách phải là chuỗi' })
  description!: string;

  /**
   * Danh sách các quy tắc retention
   */
  @IsArray({ message: 'Rules phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => RetentionRuleDto)
  rules!: RetentionRuleDto[];

  /**
   * Trạng thái hoạt động của chính sách
   */
  @IsNotEmpty({ message: 'Trạng thái hoạt động không được để trống' })
  isActive!: boolean;
}
