import { DomainError } from "./domain-error";

/**
 * Lỗi xảy ra khi không thể tạo Snowflake ID.
 *
 * @example
 * ```typescript
 * throw new GenerateSnowFlakeError('Failed to generate Snowflake ID: clock moved backwards');
 * ```
 */
export class GenerateSnowFlakeError extends DomainError {
  /**
   * Tạo một instance mới của GenerateSnowFlakeError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'SNOWFLAKE_GENERATION_FAILED',
      message,
      { errorType: 'SNOWFLAKE_GENERATION' }
    );
  }
}

