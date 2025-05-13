import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { Maybe } from '@ecoma/common-types';
import { AuditLogCategory, AuditLogSeverity, AuditLogStatus, SortOrder } from '@ecoma/alm-domain'

/**
 * DTO mô tả khoảng thời gian
 */
export class DateRangeDto {
  /**
   * Thời điểm bắt đầu (ISO string)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Thời điểm bắt đầu phải là chuỗi ISO date' })
  from?: string;

  /**
   * Thời điểm kết thúc (ISO string)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Thời điểm kết thúc phải là chuỗi ISO date' })
  to?: string;
}

/**
 * DTO mô tả bộ lọc dựa trên nội dung ContextData
 */
export class ContextDataFilterDto {
  /**
   * Khóa cần tìm trong ContextData
   */
  @IsString({ message: 'Khóa phải là chuỗi' })
  key!: string;

  /**
   * Giá trị cần so sánh (tùy chọn)
   */
  @IsOptional()
  value?: unknown;

  /**
   * Toán tử so sánh (mặc định là equals)
   */
  @IsOptional()
  @IsEnum(['equals', 'contains', 'startsWith', 'exists'], { message: 'Toán tử không hợp lệ' })
  operator?: 'equals' | 'contains' | 'startsWith' | 'exists';
}

/**
 * DTO cho truy vấn tìm kiếm các bản ghi kiểm tra
 */
export class FindAuditLogEntriesQueryDto {
  /**
   * ID của tổ chức (tùy chọn)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID tổ chức phải là UUID hợp lệ' })
  tenantId?: Maybe<string>;

  /**
   * Loại tác nhân (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Loại tác nhân phải là chuỗi' })
  initiatorType?: Maybe<string>;

  /**
   * ID của tác nhân (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'ID tác nhân phải là chuỗi' })
  initiatorId?: Maybe<string>;

  /**
   * Tên Bounded Context (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Bounded Context phải là chuỗi' })
  boundedContext?: Maybe<string>;

  /**
   * Loại hành động (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Loại hành động phải là chuỗi' })
  actionType?: Maybe<string>;

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
   * Loại thực thể (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Loại thực thể phải là chuỗi' })
  entityType?: Maybe<string>;

  /**
   * ID thực thể (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'ID thực thể phải là chuỗi' })
  entityId?: Maybe<string>;

  /**
   * Khoảng thời gian hành động xảy ra (tùy chọn)
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  timestampRange?: Maybe<DateRangeDto>;

  /**
   * Khoảng thời gian bản ghi được tạo (tùy chọn)
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  createdAtRange?: Maybe<DateRangeDto>;

  /**
   * Trạng thái hành động (tùy chọn)
   */
  @IsOptional()
  @IsEnum(AuditLogStatus, { message: 'Trạng thái không hợp lệ' })
  status?: Maybe<AuditLogStatus>;

  /**
   * Danh sách bộ lọc dựa trên nội dung ContextData (tùy chọn)
   */
  @IsOptional()
  @IsArray({ message: 'ContextDataFilters phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ContextDataFilterDto)
  contextDataFilters?: Maybe<ContextDataFilterDto[]>;

  /**
   * Số trang (mặc định là 1)
   */
  @IsOptional()
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  pageNumber?: number = 1;

  /**
   * Số lượng bản ghi trên mỗi trang (mặc định là 20)
   */
  @IsOptional()
  @IsInt({ message: 'Kích thước trang phải là số nguyên' })
  @Min(1, { message: 'Kích thước trang phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Kích thước trang không được vượt quá 100' })
  pageSize?: number = 20;

  /**
   * Trường cần sắp xếp (tùy chọn)
   */
  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi' })
  sortBy?: Maybe<string>;

  /**
   * Thứ tự sắp xếp (mặc định là desc)
   */
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Thứ tự sắp xếp không hợp lệ' })
  sortOrder?: Maybe<SortOrder> = SortOrder.Descending;
}
