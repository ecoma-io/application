import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from "@angular/core";
import { LoggerService } from "../lib/logger.service";

export function provideLoggerTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: LoggerService, useClass: LoggerServiceMock },
  ]);
}

@Injectable({ providedIn: "root" })
export class LoggerServiceMock {
  create = () => this;
  trace = jest.fn();
  debug = jest.fn();
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  fatal = jest.fn();
}
