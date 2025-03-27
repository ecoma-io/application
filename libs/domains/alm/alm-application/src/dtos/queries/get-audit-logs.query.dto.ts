import { IsOptional, IsString, IsEnum, IsNumber, IsObject, IsDateString } from 'class-validator';

export enum SortOrder {
  Asc = 'Asc',
  Desc = 'Desc',
}

export class TimestampRangeDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class GetAuditLogsQueryDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  initiatorType?: string;

  @IsOptional()
  @IsString()
  initiatorId?: string;

  @IsOptional()
  @IsString()
  boundedContext?: string;

  @IsOptional()
  @IsString()
  actionType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsObject()
  timestampRange?: TimestampRangeDto;

  @IsOptional()
  @IsObject()
  createdAtRange?: TimestampRangeDto;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  contextDataFilters?: Record<string, any>;

  @IsNumber()
  pageNumber!: number;

  @IsNumber()
  pageSize!: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
