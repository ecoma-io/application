import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IMongoDBConfig } from "../interfaces";

/**
 * MongoDB configuration class
 */
export class MongoDBConfig implements IMongoDBConfig {
  @IsBoolean()
  @IsOptional()
  isEnabled = false;

  @IsString()
  uri!: string;

  @IsString()
  @IsOptional()
  databaseName?: string;

  constructor(partial: Partial<MongoDBConfig>) {
    Object.assign(this, partial);
  }
}
