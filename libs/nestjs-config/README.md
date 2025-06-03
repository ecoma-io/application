# @nestjs-config

This library provides a utility function `registerConfig` for NestJS applications to easily load and validate environment variables using `class-transformer` and `class-validator`.

## Installation

```bash
npm install @ecoma/nestjs-config @nestjs/config class-transformer class-validator
# or using yarn
yarn add @ecoma/nestjs-config @nestjs/config class-transformer class-validator
# or using pnpm
pnpm add @ecoma/nestjs-config @nestjs/config class-transformer class-validator
```

## Usage

The `registerConfig` function takes the following arguments:

- `token`: A string token to identify the configuration.
- `envClss`: The class-validator class defining the structure and validation rules for environment variables.
- `defaults`: An optional object providing default values for environment variables.
- `callback`: A function that transforms the validated environment variables into a configuration object.

Here's a basic example:

```typescript
import { registerConfig } from '@ecoma/nestjs-config';
import { IsString, IsNotEmpty } from 'class-validator';

class AppEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  APP_PORT!: string;
}

export const appConfig = registerConfig(
  'app',
  AppEnvironmentVariables,
  { APP_PORT: '3000' }, // Optional default values
  (env) => ({
    port: parseInt(env.APP_PORT, 10),
  })
);
```

Then, register the configuration in your application module:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
})
export class AppModule {}
```

## Pre-defined Environment Variables

The library includes pre-defined classes for common environment variables:

### RabbitMQ

Defines `RABBITMQ_URI`.

```typescript
import { registerConfig } from '@ecoma/nestjs-config';
import { RabbitmqEnvironmentVariables } from '@ecoma/nestjs-config/dist/rabbitmq.enviroment-variables'; // Note: path might vary based on build

export const rabbitmqConfig = registerConfig(
  'rabbitmq',
  RabbitmqEnvironmentVariables,
  undefined, // No default values provided in the source
  (env) => ({
    uri: env.RABBITMQ_URI,
  })
);
```

### MongoDB

Defines `MONGODB_URI`.

```typescript
import { registerConfig } from '@ecoma/nestjs-config';
import { MongodbEnvironmentVariables } from '@ecoma/nestjs-config/dist/mongodb.enviroment-variables'; // Note: path might vary based on build

export const mongodbConfig = registerConfig(
  'mongodb',
  MongodbEnvironmentVariables,
  undefined, // No default values provided in the source
  (env) => ({
    uri: env.MONGODB_URI,
  })
);
```

## Validation

Environment variables are validated using `class-validator`. If validation fails, the application will throw an error on startup, indicating which environment variables are missing or invalid.
