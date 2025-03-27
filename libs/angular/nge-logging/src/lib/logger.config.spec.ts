/**
 * @fileoverview Unit test cho logger.config
 * @since 1.0.0
 */

import { isDevMode } from "@angular/core";
import { Logger } from "pino";

import { browserWriteFn, createPinoLogger } from "./logger.config";
import { formatLogLevel, formatLogScope, getConsoleFunction } from "./utils";

jest.mock("@angular/core", () => ({
  isDevMode: jest.fn(),
}));

describe("createPinoLogger", () => {
  let logger: Logger;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a logger with trace level in development mode", () => {
    (isDevMode as jest.Mock).mockReturnValue(true);
    logger = createPinoLogger();
    expect(logger).toBeDefined();
    expect(logger.level).toBe("trace");
  });

  it("should create a logger with warn level in production mode", () => {
    (isDevMode as jest.Mock).mockReturnValue(false);
    logger = createPinoLogger();
    expect(logger).toBeDefined();
    expect(logger.level).toBe("warn");
  });
});

describe("browserWriteFn", () => {
  let consoleSpy: { [key: string]: jest.SpyInstance };

  beforeEach(() => {
    // Mock all console methods
    consoleSpy = {
      log: jest.spyOn(console, "log").mockImplementation(),
      info: jest.spyOn(console, "info").mockImplementation(),
      warn: jest.spyOn(console, "warn").mockImplementation(),
      error: jest.spyOn(console, "error").mockImplementation(),
      debug: jest.spyOn(console, "debug").mockImplementation(),
      trace: jest.spyOn(console, "trace").mockImplementation(),
    };
  });

  afterEach(() => {
    // Restore all mocks
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
  });

  it("should log messages with correct format", () => {
    const logObj = { level: "info", msg: "Test message", scope: "TestScope" };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);
    const consoleFunc = getConsoleFunction(logObj.level);

    expect(consoleSpy[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`
    );
  });

  it("should log messages with extra attributes", () => {
    const logObj = {
      level: "debug",
      msg: "Test message",
      scope: "TestScope",
      key: "value",
    };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);
    const consoleFunc = getConsoleFunction(logObj.level);
    const { level, msg, scope, ...rest } = logObj;

    expect(consoleSpy[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${msg}`,
      rest
    );
  });

  it("should handle unknown log levels by using console.log", () => {
    const logObj = {
      level: "unknown",
      msg: "Test message",
      scope: "TestScope",
    };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);

    expect(consoleSpy["log"]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`
    );
  });

  it("should handle missing scope", () => {
    const logObj = { level: "info", msg: "Test message" };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(undefined);
    const consoleFunc = getConsoleFunction(logObj.level);

    expect(consoleSpy[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`
    );
  });
});
