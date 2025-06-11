import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { Logger } from "pino";

import { createPinoLogger } from "./logger.config";

export const LOGGER_SCOPE = new InjectionToken<string>("LOGGER_SCOPE");

export function provideLoggerScope(scope: string) {
  return { provide: LOGGER_SCOPE, useValue: scope };
}

export const PINO_LOGGER = new InjectionToken<Logger>("PINO_LOGGER");

@Injectable({ providedIn: "root" })
export class LoggerService {
  private logger: Logger;

  constructor(
    @Optional() @Inject(LOGGER_SCOPE) private scope?: string,
    @Optional() @Inject(PINO_LOGGER) logger?: Logger
  ) {
    this.logger = logger ?? createPinoLogger();
    if (this.scope) {
      this.logger = this.logger.child({ scope: this.scope });
    }
  }

  create(scope: string): LoggerService {
    return new LoggerService(scope, this.logger);
  }

  trace(msg: string, obj?: object) {
    this.logger.trace(obj || {}, msg);
  }

  debug(msg: string, obj?: object) {
    this.logger.debug(obj || {}, msg);
  }

  info(msg: string, obj?: object) {
    this.logger.info(obj || {}, msg);
  }

  warn(msg: string, obj?: object) {
    this.logger.warn(obj || {}, msg);
  }

  error(msg: string, obj?: object) {
    this.logger.error(obj || {}, msg);
  }

  fatal(msg: string, obj?: object) {
    this.logger.fatal(obj || {}, msg);
  }
}
