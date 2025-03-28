/**
 * @fileoverview Provider cho ApplicationLoggerAdapter trong ALM module
 * @since 1.0.0
 */

import { ApplicationLoggerAdapter, NestjsLogger } from "@ecoma/nestjs-logging";

/**
 * Token dùng để inject logger vào application layer của ALM
 */
export const ALM_APPLICATION_LOGGER = "ALM_APPLICATION_LOGGER";

/**
 * Factory tạo ApplicationLoggerAdapter cho ALM module
 * @param nestjsLogger - Instance của NestjsLogger
 * @returns ApplicationLoggerAdapter - Logger đã cấu hình cho ALM application layer
 */
export const createAlmApplicationLogger = (nestjsLogger: NestjsLogger) => {
  return new ApplicationLoggerAdapter(nestjsLogger, "ALM-Application");
};
