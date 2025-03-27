# @ecoma/common-infrastructure

Thư viện này cung cấp các building blocks cho tầng Infrastructure dùng chung trong hệ thống Ecoma, giúp chuẩn hóa các giải pháp về persistence, messaging, caching, security, error handling...

## Cài đặt

Thư viện đã được cài đặt sẵn trong monorepo. Import các thành phần cần thiết:

```typescript
import { IPersistence, IMessageBus, ICacheProvider, ISecurityService } from "@ecoma/common-infrastructure";
```

## Cấu trúc thư viện

```
src/lib/
  persistence/   # Các interface và implement lưu trữ dữ liệu
  messaging/     # Messaging bus, event publisher/subscriber
  caching/       # Caching provider
  security/      # Security, encryption, hash...
  errors/        # Infrastructure-level errors
```

## Các thành phần chính

- **Persistence**: IPersistence, IRepository, các implement cho database
- **Messaging**: IMessageBus, event publisher/subscriber
- **Caching**: ICacheProvider, các implement cho Redis, memory...
- **Security**: ISecurityService, các hàm mã hóa, hash, kiểm tra quyền
- **Errors**: Chuẩn hóa lỗi tầng infrastructure

### Ví dụ sử dụng

#### Persistence

```typescript
import { IPersistence } from "@ecoma/common-infrastructure";

class UserRepository implements IPersistence {
  async save(entity: any) {
    // Lưu entity vào database
  }
  async findById(id: string) {
    // Truy vấn entity theo id
  }
}
```

#### Messaging

```typescript
import { IMessageBus } from "@ecoma/common-infrastructure";

class MyMessageBus implements IMessageBus {
  async publish(topic: string, message: any) {
    // Gửi message tới topic
  }
  async subscribe(topic: string, handler: (msg: any) => void) {
    // Đăng ký nhận message
  }
}
```

#### Caching

```typescript
import { ICacheProvider } from "@ecoma/common-infrastructure";

class RedisCacheProvider implements ICacheProvider {
  async get(key: string) {
    // Lấy giá trị từ Redis
  }
  async set(key: string, value: any) {
    // Lưu giá trị vào Redis
  }
}
```

#### Security

```typescript
import { ISecurityService } from "@ecoma/common-infrastructure";

class MySecurityService implements ISecurityService {
  hashPassword(password: string): string {
    // Hash password
    return "hashed-" + password;
  }
  verifyPassword(password: string, hash: string): boolean {
    // Kiểm tra password
    return hash === "hashed-" + password;
  }
}
```

#### Errors

```typescript
import { InfrastructureError } from "@ecoma/common-infrastructure";

class DatabaseConnectionError extends InfrastructureError {
  constructor(message: string) {
    super(message);
  }
}
```

#### Accessing Custom Application Config

```typescript
// some.service.ts
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService, CUSTOM_APP_CONFIG } from "@ecoma/common-infrastructure";
import { AppConfig } from "./app.config";

@Injectable()
export class SomeService {
  constructor(private readonly configService: ConfigService, @Inject(CUSTOM_APP_CONFIG) private readonly appConfig: AppConfig) {}

  someMethod() {
    // Access standard config methods
    const port = this.configService.getPort();

    // Access your custom app config
    const apiKey = this.appConfig.apiKey;
    const serviceUrl = this.appConfig.serviceUrl;
  }
}
```

## Xây dựng và kiểm thử

```bash
nx build common-infrastructure
nx test common-infrastructure
```

# Common Infrastructure

This library contains common infrastructure components that can be used across all applications.

## Configuration Module

The configuration module provides a flexible way to manage application configuration through environment variables.

### Features

- Environment variable validation using Joi
- Support for MongoDB, RabbitMQ, Redis, NATS, and S3/MinIO configurations
- Extensible for application-specific configurations
- Type-safe configuration access

### Usage

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@ecoma/common-infrastructure";
import { AppConfig } from "./app.config";

@Module({
  imports: [
    ConfigModule.register({
      isGlobal: true,
      appConfig: AppConfig, // Optional: Your application-specific config class
      envFilePath: ".env",
    }),
  ],
})
export class AppModule {}
```

#### Creating Custom Application Config

You can extend the base `AppConfig` class to add application-specific configuration:

```typescript
// app.config.ts
import { AppConfig as BaseAppConfig } from "@ecoma/common-infrastructure";
import { IsString, IsOptional } from "class-validator";

export class AppConfig extends BaseAppConfig {
  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  serviceUrl?: string;
}
```

#### Accessing Configuration

```typescript
// some.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@ecoma/common-infrastructure";

@Injectable()
export class SomeService {
  constructor(private readonly configService: ConfigService) {}

  someMethod() {
    // Access basic app config
    const port = this.configService.getPort();
    const isDebug = this.configService.isDebug();

    // Access MongoDB config
    const mongoConfig = this.configService.getMongoDBConfig();
    if (mongoConfig.isEnabled) {
      // Use MongoDB configuration
    }

    // Access RabbitMQ config
    const rabbitConfig = this.configService.getRabbitMQConfig();

    // Access Redis config
    const redisConfig = this.configService.getRedisConfig();

    // Access NATS config
    const natsConfig = this.configService.getNatsConfig();

    // Access S3 config
    const s3Config = this.configService.getS3Config();
  }
}
```

### Environment Variables

The configuration module supports the following environment variables:

#### Application Settings

- `NODE_ENV`: Application environment (`development`, `production`, `test`)
- `PORT`: Application port (default: 3000)
- `DEBUG`: Debug mode flag (default: false)
- `LOG_LEVEL`: Logging level (`trace`, `debug`, `info`, `warn`, `error`)
- `LOG_FORMAT`: Logging format (`json`, `text`)

#### MongoDB Settings

- `MONGODB_ENABLED`: Enable MongoDB (default: false)
- `MONGODB_URI`: MongoDB connection URI (required if enabled)
- `MONGODB_DB_NAME`: MongoDB database name (optional)

#### NATS Settings

- `NATS_ENABLED`: Enable NATS (default: false)
- `NATS_URI`: NATS server URL (required if enabled)

#### RabbitMQ Settings

- `RABBITMQ_ENABLED`: Enable RabbitMQ (default: false)
- `RABBITMQ_URI`: RabbitMQ connection URI (required if enabled)
- `RABBITMQ_EXCHANGE`: RabbitMQ exchange name (default: 'events')
- `RABBITMQ_EXCHANGE_TYPE`: RabbitMQ exchange type (default: 'topic')
- `RABBITMQ_QUEUE`: RabbitMQ queue name (optional)

#### Redis Settings

- `REDIS_ENABLED`: Enable Redis (default: false)
- `REDIS_HOST`: Redis host (required if enabled)
- `REDIS_PORT`: Redis port (required if enabled)
- `REDIS_PASSWORD`: Redis password (optional)
- `REDIS_DB`: Redis database number (optional)

#### S3/MinIO Settings

- `S3_ENABLED`: Enable S3/MinIO (default: false)
- `S3_ENDPOINT`: Custom endpoint for MinIO (optional)
- `S3_REGION`: S3 region (required if enabled)
- `S3_ACCESS_KEY`: S3 access key (required if enabled)
- `S3_SECRET_KEY`: S3 secret key (required if enabled)
- `S3_BUCKET`: S3 bucket name (required if enabled)
- `S3_FORCE_PATH_STYLE`: Enable path style for MinIO (default: false)

## Enumerations

- [Environment](/libraries/common-infrastructure/Enumeration.Environment.md)
- [LogFormat](/libraries/common-infrastructure/Enumeration.LogFormat.md)
- [LogLevel](/libraries/common-infrastructure/Enumeration.LogLevel.md)

## Classes

- [AbstractMongoReadRepository](/libraries/common-infrastructure/Class.AbstractMongoReadRepository.md)
- [AppConfig](/libraries/common-infrastructure/Class.AppConfig.md)
- [AppLogger](/libraries/common-infrastructure/Class.AppLogger.md)
- [ConfigModule](/libraries/common-infrastructure/Class.ConfigModule.md)
- [ConfigService](/libraries/common-infrastructure/Class.ConfigService.md)
- [HealthModule](/libraries/common-infrastructure/Class.HealthModule.md)
- [MongoDBConfig](/libraries/common-infrastructure/Class.MongoDBConfig.md)
- [MongoQueryHelpers](/libraries/common-infrastructure/Class.MongoQueryHelpers.md)
- [NatsConfig](/libraries/common-infrastructure/Class.NatsConfig.md)
- [NestjsLogger](/libraries/common-infrastructure/Class.NestjsLogger.md)
- [RabbitMQConfig](/libraries/common-infrastructure/Class.RabbitMQConfig.md)
- [RedisConfig](/libraries/common-infrastructure/Class.RedisConfig.md)
- [S3Config](/libraries/common-infrastructure/Class.S3Config.md)

## Interfaces

- [IConfig](/libraries/common-infrastructure/Interface.IConfig.md)
- [IConfigModuleOptions](/libraries/common-infrastructure/Interface.IConfigModuleOptions.md)
- [IMongoDBConfig](/libraries/common-infrastructure/Interface.IMongoDBConfig.md)
- [INatsConfig](/libraries/common-infrastructure/Interface.INatsConfig.md)
- [IRabbitMQConfig](/libraries/common-infrastructure/Interface.IRabbitMQConfig.md)
- [IRedisConfig](/libraries/common-infrastructure/Interface.IRedisConfig.md)
- [IS3Config](/libraries/common-infrastructure/Interface.IS3Config.md)

## Type Aliases

- [MongoQuery](/libraries/common-infrastructure/TypeAlias.MongoQuery.md)

## Variables

- [baseEnvValidationSchema](/libraries/common-infrastructure/Variable.baseEnvValidationSchema.md)
- [CUSTOM_APP_CONFIG](/libraries/common-infrastructure/Variable.CUSTOM_APP_CONFIG.md)
