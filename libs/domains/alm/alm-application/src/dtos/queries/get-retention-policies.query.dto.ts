import { FilterCriteria, ISort } from "@ecoma/common-domain";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

/**
 * DTO cho điều kiện sắp xếp
 */
export class SortDto implements ISort {
  /** Tên trường sắp xếp */
  @IsString()
  field!: string;

  /** Hướng sắp xếp */
  @IsString()
  @IsIn(["asc", "desc"])
  direction!: "asc" | "desc";
}

/**
 * DTO cho truy vấn danh sách Retention Policy
 */
export class GetRetentionPoliciesQueryDto {
  /** Vị trí bắt đầu lấy dữ liệu */
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset = 0;

  /** Số lượng bản ghi tối đa trả về */
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit = 10;

  /** Điều kiện sắp xếp */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sorts?: SortDto[];

  /** Điều kiện lọc */
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  filters?: FilterCriteria;

  /** Chỉ lấy các policy đang kích hoạt */
  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean;
}
