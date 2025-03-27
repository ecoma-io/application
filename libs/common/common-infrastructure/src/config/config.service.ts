import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import {
  MongoDBConfig,
  NatsConfig,
  RabbitMQConfig,
  RedisConfig,
  S3Config,
} from "./entities";
import { Environment, LogFormat, LogLevel } from "./entities/app.config";
import {
  IMongoDBConfig,
  INatsConfig,
  IRabbitMQConfig,
  IRedisConfig,
  IS3Config,
} from "./interfaces";

/**
 * Extended configuration service
 */
@Injectable()
export class ConfigService extends NestConfigService {
  /**
   * Get application environment
   */
  getEnvironment(): Environment {
    return this.get<Environment>("NODE_ENV", Environment.Development);
  }

  /**
   * Get application port
   */
  getPort(): number {
    return this.get<number>("PORT", 3000);
  }

  /**
   * Get debug mode
   */
  isDebug(): boolean {
    return this.get<boolean>("DEBUG", false);
  }

  /**
   * Get log level
   */
  getLogLevel(): LogLevel {
    return this.get<LogLevel>("LOG_LEVEL", LogLevel.Info);
  }

  /**
   * Get log format
   */
  getLogFormat(): LogFormat {
    return this.get<LogFormat>("LOG_FORMAT", LogFormat.Json);
  }

  /**
   * Get MongoDB configuration
   */
  getMongoDBConfig(): IMongoDBConfig {
    return new MongoDBConfig({
      isEnabled: this.get<boolean>("MONGODB_ENABLED", false),
      uri: this.get<string>("MONGODB_URI", ""),
      databaseName: this.get<string>("MONGODB_DB_NAME"),
    });
  }

  /**
   * Get NATS configuration
   */
  getNatsConfig(): INatsConfig {
    return new NatsConfig({
      isEnabled: this.get<boolean>("NATS_ENABLED", false),
      url: this.get<string>("NATS_URI", ""),
    });
  }

  /**
   * Get RabbitMQ configuration
   */
  getRabbitMQConfig(): IRabbitMQConfig {
    return new RabbitMQConfig({
      isEnabled: this.get<boolean>("RABBITMQ_ENABLED", false),
      uri: this.get<string>("RABBITMQ_URI", ""),
      exchange: this.get<string>("RABBITMQ_EXCHANGE", "events"),
      exchangeType: this.get<string>("RABBITMQ_EXCHANGE_TYPE", "topic"),
      queueName: this.get<string>("RABBITMQ_QUEUE"),
    });
  }

  /**
   * Get Redis configuration
   */
  getRedisConfig(): IRedisConfig {
    return new RedisConfig({
      isEnabled: this.get<boolean>("REDIS_ENABLED", false),
      host: this.get<string>("REDIS_HOST", ""),
      port: this.get<number>("REDIS_PORT", 6379),
      password: this.get<string>("REDIS_PASSWORD"),
      db: this.get<number>("REDIS_DB", 0),
    });
  }

  /**
   * Get S3 configuration
   */
  getS3Config(): IS3Config {
    return new S3Config({
      isEnabled: this.get<boolean>("S3_ENABLED", false),
      endpoint: this.get<string>("S3_ENDPOINT"),
      region: this.get<string>("S3_REGION", ""),
      accessKey: this.get<string>("S3_ACCESS_KEY", ""),
      secretKey: this.get<string>("S3_SECRET_KEY", ""),
      bucket: this.get<string>("S3_BUCKET", ""),
      forcePathStyle: this.get<boolean>("S3_FORCE_PATH_STYLE", false),
    });
  }
}
