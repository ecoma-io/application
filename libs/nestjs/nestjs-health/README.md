# nestjs-health

A NestJS module that provides health check endpoints for monitoring service health. This module supports health checks for:
- MongoDB connections
- NATS connections
- RabbitMQ connections
- Custom microservices

## Installation

```bash
yarn add @ecoma/nestjs-health
```

## Usage

```typescript
import { HealthModule } from '@ecoma/nestjs-health';
import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HealthModule.register({
      // Enable/disable built-in health checks
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: false,
      
      // Custom base path for health check endpoint (default: 'api/v1/health')
      basePath: 'api/v1/health',
      
      // Add custom service health checks
      services: [
        {
          name: 'AUTH_SERVICE',
          transport: Transport.NATS,
          options: {
            servers: ['nats://auth-service:4222']
          }
        }
      ]
    })
  ]
})
export class AppModule {}
```

## API Endpoints

### GET /api/v1/health

Returns the health status of all configured services. Example response:

```json
{
  "status": "ok",
  "info": {
    "mongodb": {
      "status": "up"
    },
    "nats": {
      "status": "up"
    },
    "auth-service": {
      "status": "up"
    }
  }
}
```

## Building

Run `nx build nestjs-health` to build the library.

## Running unit tests

Run `nx test nestjs-health` to execute the unit tests via [Jest](https://jestjs.io).
