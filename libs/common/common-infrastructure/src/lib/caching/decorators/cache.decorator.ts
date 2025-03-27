/**
 * @fileoverview Decorator cho caching
 * @since 1.0.0
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Key cho cache metadata
 */
export const CACHE_KEY_METADATA = 'cache_key_metadata';

/**
 * Decorator để đánh dấu một method cần được cache
 * @param {string} key - Key cho cache
 * @returns {Function} Decorator function
 */
export const Cache = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);
