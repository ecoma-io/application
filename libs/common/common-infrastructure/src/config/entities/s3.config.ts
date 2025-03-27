import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IS3Config } from "../interfaces";

/**
 * S3 configuration class (also supports MinIO)
 */
export class S3Config implements IS3Config {
  @IsBoolean()
  @IsOptional()
  isEnabled = false;

  @IsString()
  @IsOptional()
  endpoint?: string;

  @IsString()
  region!: string;

  @IsString()
  accessKey!: string;

  @IsString()
  secretKey!: string;

  @IsString()
  bucket!: string;

  @IsBoolean()
  @IsOptional()
  forcePathStyle?: boolean;

  constructor(partial: Partial<S3Config>) {
    Object.assign(this, partial);
  }
}
