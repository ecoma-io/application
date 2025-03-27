/**
 * Base interface for all configurations
 */
export interface IConfig {
  isEnabled: boolean;
}

/**
 * Interface for MongoDB configuration
 */
export interface IMongoDBConfig extends IConfig {
  uri: string;
  databaseName?: string;
}

/**
 * Interface for RabbitMQ configuration
 */
export interface IRabbitMQConfig extends IConfig {
  uri: string;
  exchange?: string;
  exchangeType?: string;
  queueName?: string;
}

/**
 * Interface for Redis configuration
 */
export interface IRedisConfig extends IConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

/**
 * Interface for NATS configuration
 */
export interface INatsConfig extends IConfig {
  url: string;
}

/**
 * Interface for AWS S3 configuration (also supports MinIO)
 */
export interface IS3Config extends IConfig {
  endpoint?: string; // Custom endpoint for MinIO
  region: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  forcePathStyle?: boolean; // Enable path style for MinIO
}
