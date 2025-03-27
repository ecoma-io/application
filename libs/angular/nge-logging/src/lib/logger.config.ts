import { isDevMode } from "@angular/core";
import pino, { Logger, WriteFn } from "pino";

import { formatLogLevel, formatLogScope, getConsoleFunction } from "./utils";

export const browserWriteFn: WriteFn = (logObj) => {
  // Get attributes from log object
  const { level, msg, scope, ...rest } = logObj as Record<string, unknown>;

  const levelFormatted = formatLogLevel(String(level));
  const scopeFormatted = formatLogScope(scope as string);
  const consoleFunc = getConsoleFunction(String(level));

  // Remove unnecessary attributes in developmet mode
  delete rest["time"];

  if (rest && Object.keys(rest).length > 0) {
    // eslint-disable-next-line no-console
    console[consoleFunc](`${levelFormatted}${scopeFormatted}${msg}`, rest);
  } else {
    // eslint-disable-next-line no-console
    console[consoleFunc](`${levelFormatted}${scopeFormatted}${msg}`);
  }
};

export function createPinoLogger(): Logger {
  if (isDevMode()) {
    // Development mode print with colorize
    return pino({
      level: "trace",
      browser: {
        write: browserWriteFn,
        formatters: {
          level: (label: string) => ({ level: label }),
        },
      },
    });
  } else {
    // Production: return log as object. Useful when remote write log
    return pino({
      level: "warn",
      browser: { asObject: true },
    });
  }
}
