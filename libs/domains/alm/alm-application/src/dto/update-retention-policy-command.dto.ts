import { DataTransferObject } from "@ecoma/common-application";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRetentionPolicyCommandDto extends DataTransferObject {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  boundedContext?: string;

  @IsOptional()
  @IsString()
  actionType?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsNumber()
  retentionDays!: number;

  @IsBoolean()
  isActive!: boolean;
}
