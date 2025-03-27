import { DataTransferObject } from "@ecoma/common-application";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsIP,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class InitiatorDto extends DataTransferObject {
  @IsIn(["User", "System", "Integration"])
  type!: "User" | "System" | "Integration";

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class AuditContextDto extends DataTransferObject {
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;

  // Cho phép các trường bổ sung
  [key: string]: unknown;
}

export class IngestAuditLogDto extends DataTransferObject {
  @IsDateString()
  timestamp!: string;

  @ValidateNested()
  @Type(() => InitiatorDto)
  initiator!: InitiatorDto;

  @IsString()
  boundedContext!: string;

  @IsString()
  actionType!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AuditContextDto)
  contextData?: AuditContextDto;
}
