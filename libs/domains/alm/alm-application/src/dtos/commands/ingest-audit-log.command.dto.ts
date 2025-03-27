import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export enum AuditLogStatus {
  Success = "Success",
  Failure = "Failure",
}

export class InitiatorDto {
  @IsString()
  @IsNotEmpty()
  type!: string; // User, System, API, ScheduledTask, Integration

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class AuditContextDto {
  @IsObject()
  @IsOptional()
  value?: Record<string, unknown>;
}

export class IngestAuditLogCommandDto {
  @IsDateString()
  timestamp!: string;

  @ValidateNested()
  @Type(() => InitiatorDto)
  initiator!: InitiatorDto;

  @IsString()
  @IsNotEmpty()
  boundedContext!: string;

  @IsString()
  @IsNotEmpty()
  actionType!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @ValidateNested()
  @Type(() => AuditContextDto)
  @IsOptional()
  contextData?: AuditContextDto;

  @IsEnum(AuditLogStatus)
  status!: AuditLogStatus;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;
}
