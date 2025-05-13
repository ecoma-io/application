import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Maybe } from '@ecoma/common-types';
import { AuditLogCategory, AuditLogSeverity, AuditLogStatus } from '@ecoma/alm-domain';

/**
 * DTO mô tả thông tin người hoặc hệ thống đã thực hiện hành động
 */
export class InitiatorDto {
  /**
   * Loại tác nhân (User, System, API, ScheduledTask, Integration)
   */
  @IsNotEmpty({ message: 'Loại tác nhân không được để trống' })
  @IsString({ message: 'Loại tác nhân phải là chuỗi' })
  type!: string;

  /**
   * ID định danh của tác nhân (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'ID tác nhân phải là chuỗi' })
  id?: Maybe<string>;

  /**
   * Tên hiển thị của tác nhân
   */
  @IsNotEmpty({ message: 'Tên tác nhân không được để trống' })
  @IsString({ message: 'Tên tác nhân phải là chuỗi' })
  name!: string;
}

/**
 * DTO cho lệnh tạo một bản ghi kiểm tra mới
 */
export class CreateAuditLogEntryCommandDto {
  /**
   * ID của sự kiện gốc (tuỳ chọn)
   */
  @IsOptional()
  @IsString({ message: 'ID sự kiện phải là chuỗi' })
  eventId?: Maybe<string>;

  /**
   * Thời điểm hành động xảy ra
   */
  @IsNotEmpty({ message: 'Thời điểm hành động không được để trống' })
  @IsDate({ message: 'Thời điểm hành động phải là ngày giờ hợp lệ' })
  timestamp!: Date;

  /**
   * Người hoặc hệ thống đã thực hiện hành động
   */
  @IsNotEmpty({ message: 'Thông tin tác nhân không được để trống' })
  @ValidateNested()
  @Type(() => InitiatorDto)
  initiator!: InitiatorDto;

  /**
   * Tên Bounded Context nguồn
   */
  @IsNotEmpty({ message: 'Bounded Context không được để trống' })
  @IsString({ message: 'Bounded Context phải là chuỗi' })
  boundedContext!: string;

  /**
   * Loại hành động
   */
  @IsNotEmpty({ message: 'Loại hành động không được để trống' })
  @IsString({ message: 'Loại hành động phải là chuỗi' })
  actionType!: string;

  /**
   * Danh mục (tùy chọn)
   */
  @IsOptional()
  @IsEnum(AuditLogCategory, { message: 'Danh mục không hợp lệ' })
  category?: Maybe<AuditLogCategory>;

  /**
   * Mức độ nghiêm trọng (tùy chọn)
   */
  @IsOptional()
  @IsEnum(AuditLogSeverity, { message: 'Mức độ nghiêm trọng không hợp lệ' })
  severity?: Maybe<AuditLogSeverity>;

  /**
   * ID thực thể bị ảnh hưởng (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'ID thực thể phải là chuỗi' })
  entityId?: Maybe<string>;

  /**
   * Loại thực thể bị ảnh hưởng (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Loại thực thể phải là chuỗi' })
  entityType?: Maybe<string>;

  /**
   * ID của tổ chức (tùy chọn)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID tổ chức phải là UUID hợp lệ' })
  tenantId?: Maybe<string>;

  /**
   * Dữ liệu ngữ cảnh bổ sung
   */
  @IsNotEmpty({ message: 'Dữ liệu ngữ cảnh không được để trống' })
  contextData!: Record<string, unknown>;

  /**
   * Trạng thái của hành động
   */
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(AuditLogStatus, { message: 'Trạng thái không hợp lệ' })
  status!: AuditLogStatus;

  /**
   * Lý do thất bại (tùy chọn, chỉ có khi status là Failure)
   */
  @IsOptional()
  @IsString({ message: 'Lý do thất bại phải là chuỗi' })
  failureReason?: Maybe<string>;
}
