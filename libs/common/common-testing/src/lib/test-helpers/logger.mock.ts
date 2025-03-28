/**
 * @fileoverview Mock của Logger interface để sử dụng trong tests
 * @since 1.0.0
 */

import { fn } from 'jest-mock';
import { ILogger } from '@ecoma/common-application';

/**
 * Mock implementation của ILogger để sử dụng trong test
 */
export class LoggerMock implements ILogger {
  debug = fn();
  info = fn();
  warn = fn();
  error = fn();
  fatal = fn();
}
