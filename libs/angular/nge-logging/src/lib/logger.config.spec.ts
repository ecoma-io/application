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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "trace").mockImplementation();
  });

  it("should log messages with correct format", () => {
    const logObj = { level: "info", msg: "Test message", scope: "TestScope" };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);
    const consoleFunc = getConsoleFunction(logObj.level);

    expect(console[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`
    );
  });

  it("should log messages with extra attributes", () => {
    const logObj = {
      level: "debug",
      msg: "Debug message",
      scope: "DebugScope",
      extra: "data",
    };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);
    const consoleFunc = getConsoleFunction(logObj.level);

    expect(console[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`,
      { extra: "data" }
    );
  });

  it("should remove time attribute from logs", () => {
    const logObj = {
      level: "warn",
      msg: "Warning message",
      scope: "WarnScope",
      time: 123456789,
    };
    browserWriteFn(logObj);
    const expectedLevel = formatLogLevel(logObj.level);
    const expectedScope = formatLogScope(logObj.scope);
    const consoleFunc = getConsoleFunction(logObj.level);

    expect(console[consoleFunc]).toHaveBeenCalledWith(
      `${expectedLevel}${expectedScope}${logObj.msg}`
    );
  });
});
