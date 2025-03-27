import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateRetentionPolicyCommandDto {
  @IsString()
  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  retentionDays!: number;

  @IsBoolean()
  isActive!: boolean;
}
