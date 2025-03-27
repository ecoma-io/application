import { AbstractLogger } from "@ecoma/common-application";
import { NestjsPino } from "./nestjs-pino";

export class AppLogger extends AbstractLogger {
  constructor(private context?: string) {
    super();
  }

  setContext(context: string): void {
    this.context = context;
  }

  debug(message: string, optionalParams?: Record<string, unknown>): void {
    NestjsPino.getPinoLogger().debug(
      { ...optionalParams, context: this.context },
      message
    );
  }

  info(message: string, optionalParams?: Record<string, unknown>): void {
    NestjsPino.getPinoLogger().info(
      { ...optionalParams, context: this.context },
      message
    );
  }
  warn(message: string, optionalParams?: Record<string, unknown>): void {
    NestjsPino.getPinoLogger().warn(
      { ...optionalParams, context: this.context },
      message
    );
  }
  error(
    message: string,
    error?: Error,
    optionalParams?: Record<string, unknown>
  ): void {
    NestjsPino.getPinoLogger().error(
      { ...optionalParams, err: error, context: this.context },
      message
    );
  }
  fatal(
    message: string,
    error?: Error,
    optionalParams?: Record<string, unknown>
  ): void {
    NestjsPino.getPinoLogger().fatal(
      { ...optionalParams, err: error, context: this.context },
      message
    );
  }
}
