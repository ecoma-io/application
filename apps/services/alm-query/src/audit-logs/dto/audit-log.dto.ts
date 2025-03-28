/**
 * @fileoverview DTO cho audit log responses
 * @since 1.0.0
 */

import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

/**
 * DTO cho Initiator trong audit log
 */
export class InitiatorDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;
}

/**
 * DTO cho Resource trong audit log
 */
export class ResourceDto {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;
}

/**
 * DTO cho một thay đổi (change) trong audit log
 */
export class ChangeDto {
  @IsString()
  field: string;

  oldValue: any;

  newValue: any;
}

/**
 * DTO cho audit log response
 */
export class AuditLogDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsDate()
  timestamp: Date;

  @ValidateNested()
  @Type(() => InitiatorDto)
  initiator: InitiatorDto;

  @IsString()
  @IsOptional()
  action?: string;

  @ValidateNested()
  @Type(() => ResourceDto)
  @IsOptional()
  resource?: ResourceDto;

  @IsString()
  boundedContext: string;

  @IsString()
  actionType: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  failureReason?: string;

  @IsDate()
  createdAt: Date;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangeDto)
  @IsOptional()
  changes?: ChangeDto[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO cho phân trang các audit logs
 */
export class PaginatedAuditLogResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuditLogDto)
  items: AuditLogDto[];

  total: number;

  page: number;

  pageSize: number;
}
