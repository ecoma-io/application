import pino, { Level, Logger } from 'pino';
import pinoPretty from 'pino-pretty';

/**
 * Lớp NestjsPino cung cấp các phương thức để tạo và cấu hình logger Pino.
 */
export class Pino {
  /**
   * Biến lưu trữ instance của Pino logger.
   */
  private static logger: Logger;

  /**
   * Phương thức tĩnh trả về instance của Pino logger.
   * Nếu logger chưa được khởi tạo, phương thức sẽ tạo mới và cấu hình logger.
   *
   * @returns {Logger} Instance của Pino logger.
   */
  public static getPinoLogger(): Logger {
    if (!Pino.logger) {
      const instance = new Pino();
      Pino.logger = pino({ level: instance.getLevel() }, instance.getStream());
    }
    return Pino.logger;
  }

  /**
   * Lấy cấp độ log từ biến môi trường hoặc giá trị mặc định.
   *
   * @private
   * @returns {Level} Cấp độ log hợp lệ.
   * @throws {Error} Nếu cấp độ log không hợp lệ.
   */
  private getLevel() {
    const level = process.env['LOG_LEVEL'] || 'info';
    if (level !== 'debug' && level !== 'info' && level !== 'warn' && level !== 'error' && level !== 'fatal') {
      throw new Error(`Invalid log level: ${level}. Use 'debug', 'info', 'warn', 'error', or 'fatal'`);
    }
    return level as Level;
  }

  /**
   * Lấy định dạng log từ biến môi trường hoặc giá trị mặc định.
   *
   * @private
   * @returns {"json"|"text"} Định dạng log hợp lệ.
   * @throws {Error} Nếu định dạng log không hợp lệ.
   */
  private getFormat() {
    const format = process.env['LOG_FORMAT'] || 'json';
    if (format !== 'json' && format !== 'text') {
      throw new Error(`Invalid log format: ${format}. Use 'json' or 'text'`);
    }
    return format as 'json' | 'text';
  }

  /**
   * Lấy stream output phù hợp với định dạng được cấu hình.
   *
   * @private
   * @returns {object|undefined} Stream đã cấu hình hoặc undefined nếu sử dụng mặc định.
   */
  private getStream() {
    return this.getFormat() === 'text'
      ? pinoPretty({
          sync: true,
          colorize: true,
          ignore: 'pid,hostname,context',
          messageFormat: '[{pid}] [{context}] {msg}',
        })
      : undefined;
  }
}
