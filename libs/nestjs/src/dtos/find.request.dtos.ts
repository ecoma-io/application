import { ApiProperty } from '@nestjs/swagger'; // Tùy chọn
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({
    description: 'Số lượng bản ghi trên mỗi trang',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là một số nguyên.' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1.' })
  @Max(100, { message: 'Limit không được lớn hơn 100.' }) // Giới hạn tối đa để tránh tải quá nhiều dữ liệu
  limit?: number = 10;

  @ApiProperty({
    description: 'Số trang hiện tại',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page phải là một số nguyên.' })
  @Min(1, { message: 'Page phải lớn hơn hoặc bằng 1.' })
  page?: number = 1;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortingDTO {
  @ApiProperty({
    description: 'Trường để sắp xếp',
    required: false,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'Sort by phải là một chuỗi.' })
  sortBy?: string;

  @ApiProperty({
    description: 'Thứ tự sắp xếp (asc hoặc desc)',
    required: false,
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsIn([SortOrder.ASC, SortOrder.DESC], {
    message: 'Sort order phải là "asc" hoặc "desc".',
  })
  sortOrder?: SortOrder = SortOrder.ASC;
}

export enum FilterOperator {
  EQUAL = 'eq',
  NOT_EQUAL = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like', // Case-sensitive partial match
  ILIKE = 'ilike', // Case-insensitive partial match
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
}

export class FilterDTO {
  @ApiProperty({
    description: 'Tên trường cần lọc',
    example: 'name',
  })
  @IsString({ message: 'Field name phải là một chuỗi.' })
  field!: string;

  @ApiProperty({
    description: 'Toán tử lọc',
    enum: FilterOperator,
    example: FilterOperator.EQUAL,
  })
  @IsEnum(FilterOperator, { message: 'Toán tử lọc không hợp lệ.' })
  operator!: FilterOperator;

  @ApiProperty({
    description: 'Giá trị để lọc',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  // Sử dụng @Type để chuyển đổi kiểu dữ liệu nếu cần, ví dụ: nếu giá trị là số
  // @Type(() => String) // Hoặc Number, Boolean, Date... tùy thuộc vào trường
  value?: string | number | boolean | string[] | number[];

  @ApiProperty({
    description: 'Giá trị lọc khi toán tử là IN hoặc NOT_IN',
    required: false,
    type: [String],
    example: ['value1', 'value2'],
  })
  @IsOptional()
  @IsArray({
    message: 'Value array phải là một mảng khi toán tử là IN hoặc NOT_IN.',
  })
  // Đảm bảo các phần tử trong mảng cũng được kiểm tra nếu cần
  @Type(() => String) // Hoặc Number...
  values?: string[] | number[];
}

export class FindCriteriaDTO extends PaginationDTO {
  @ApiProperty({
    description: 'Tham số sắp xếp',
    type: SortingDTO,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortingDTO)
  sort?: SortingDTO;

  @ApiProperty({
    description: 'Mảng các điều kiện lọc',
    type: [FilterDTO],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Filters phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => FilterDTO)
  filters?: FilterDTO[];

  // Bạn có thể thêm các trường tìm kiếm nhanh khác ở đây nếu cần
  @ApiProperty({
    description: 'Từ khóa tìm kiếm nhanh chung (ví dụ: tìm kiếm trong nhiều trường)',
    required: false,
    example: 'keyword',
  })
  @IsOptional()
  @IsString({ message: 'Search keyword phải là một chuỗi.' })
  search?: string;
}
