import { LoggerService } from '@nestjs/common';
import { Level } from 'pino';
import { Pino } from './pino';

/**
 * Service cung cấp logging cho NestJS dựa trên Pino.
 * Lớp này triển khai LoggerService của NestJS và sử dụng Pino làm backend.
 *
 * @since 1.0.0
 * @implements {LoggerService}
 *
 * @example
 * ```typescript
 * // Sử dụng làm logger toàn cục
 * const app = await NestFactory.create(AppModule);
 * app.useLogger(new NestjsLogger('AppName'));
 *
 * // Sử dụng thông qua dependency injection
 * @Injectable()
 * class MyService {
 *   constructor(@Inject(NestjsLogger) private logger: NestjsLogger) {
 *     this.logger.setContext('MyService');
 *   }
 *
 *   doSomething() {
 *     this.logger.info('Đang xử lý tác vụ');
 *   }
 * }
 * ```
 */
export class PinoLogger implements LoggerService {
  /**
   * Tạo một instance mới của NestjsLogger
   *
   * @param {string} [context] - Context của logger, thường là tên của module/service
   */
  constructor(private context?: string) {}

  /**
   * Xử lý logic ghi log cho tất cả các cấp độ
   *
   * @private
   * @param {Level} level - Cấp độ log
   * @param {any} message - Thông điệp cần ghi log
   * @param {any[]} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private call(level: Level, message: any, ...optionalParams: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objArg: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: any[] = [];

    if (this.isWrongExceptionsHandlerContract(level, message, optionalParams)) {
      const error = new Error(message);
      error.stack = optionalParams[0];
      objArg['err'] = error;
      objArg['context'] = this.context;
      Pino.getPinoLogger()[level](objArg);
      return;
    }

    // optionalParams contains extra params passed to logger
    // context name is the last item (this is convention in nestjs logger)
    if (optionalParams.length !== 0 && typeof optionalParams[optionalParams.length - 1] === 'string') {
      objArg['context'] = optionalParams[optionalParams.length - 1];
      params = optionalParams.slice(0, -1);
    } else {
      objArg['context'] = this.context;
    }

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objArg['err'] = message;
      } else {
        Object.assign(objArg, message);
      }
      Pino.getPinoLogger()[level](objArg, ...params);
    } else {
      Pino.getPinoLogger()[level](objArg, message, ...params);
    }
  }

  /**
   * Ghi log ở cấp độ debug
   *
   * @param {any} message - Thông điệp cần ghi log
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: any, ...optionalParams: any[]) {
    this.call('debug', message, ...optionalParams);
  }

  /**
   * Ghi log ở cấp độ info
   *
   * @param {any} message - Thông điệp cần ghi log
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: any, ...optionalParams: any[]) {
    this.call('info', message, ...optionalParams);
  }

  /**
   * Ghi log ở cấp độ info (alias của info để tương thích với LoggerService của NestJS)
   *
   * @param {any} message - Thông điệp cần ghi log
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, ...optionalParams: any[]) {
    this.call('info', message, ...optionalParams);
  }

  /**
   * Ghi log ở cấp độ warn
   *
   * @param {any} message - Thông điệp cần ghi log
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: any, ...optionalParams: any[]) {
    this.call('warn', message, ...optionalParams);
  }

  /**
   * Ghi log ở cấp độ error
   *
   * @param {any} message - Thông điệp cần ghi log, có thể là Error object
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, ...optionalParams: any[]) {
    this.call('error', message, ...optionalParams);
  }

  /**
   * Ghi log ở cấp độ fatal
   *
   * @param {any} message - Thông điệp cần ghi log
   * @param {...any} optionalParams - Các tham số tùy chọn, tham số cuối cùng có thể là context
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal(message: any, ...optionalParams: any[]) {
    this.call('fatal', message, ...optionalParams);
  }

  /**
   * Kiểm tra xem message và params có phù hợp với định dạng lỗi của NestJS ExceptionsHandler không
   *
   * NestJS ExceptionsHandler sử dụng cách gọi logger.error đặc biệt với message là chuỗi lỗi
   * và tham số đầu tiên là stack trace
   *
   * @private
   * @param {Level} level - Cấp độ log
   * @param {unknown} message - Thông điệp lỗi
   * @param {unknown[]} params - Danh sách tham số
   * @returns {boolean} true nếu phù hợp với định dạng lỗi của ExceptionsHandler
   */
  private isWrongExceptionsHandlerContract(level: Level, message: unknown, params: unknown[]): params is [string] {
    return (
      (level === 'error' || level === 'fatal') &&
      typeof message === 'string' &&
      params.length === 1 &&
      typeof params[0] === 'string' &&
      /\n\s*at /.test(params[0])
    );
  }
}
