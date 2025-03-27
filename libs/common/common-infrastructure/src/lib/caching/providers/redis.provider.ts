/**
 * @fileoverview Provider cho Redis cache
 * @since 1.0.0
 */

import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Provider cho Redis cache
 * @constant
 */
export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: process.env['REDIS_HOST'] || 'localhost',
      port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
      password: process.env['REDIS_PASSWORD'],
      db: parseInt(process.env['REDIS_DB'] || '0', 10),
    });
  },
};
