/**
 * @fileoverview Strategy cho Redis cache
 * @since 1.0.0
 */

import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Strategy cho Redis cache
 */
@Injectable()
export class RedisCacheStrategy {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis
  ) {}

  /**
   * Lấy giá trị từ cache
   * @param {string} key - Key của cache
   * @returns {Promise<string | null>} Giá trị được cache hoặc null nếu không tồn tại
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * Lưu giá trị vào cache
   * @param {string} key - Key của cache
   * @param {string} value - Giá trị cần lưu
   * @param {number} [ttl] - Thời gian sống của cache (giây)
   * @returns {Promise<void>}
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setex(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  /**
   * Xóa giá trị khỏi cache
   * @param {string} key - Key của cache
   * @returns {Promise<void>}
   */
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
