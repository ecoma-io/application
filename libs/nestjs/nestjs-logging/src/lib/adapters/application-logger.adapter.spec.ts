import { NestjsLogger } from "../nestjs-logger";
import { ApplicationLoggerAdapter } from "./application-logger.adapter";

describe("ApplicationLoggerAdapter", () => {
  let adapter: ApplicationLoggerAdapter;
  let nestjsLogger: NestjsLogger;

  beforeEach(() => {
    // Mock NestjsLogger
    nestjsLogger = {
      setContext: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as NestjsLogger;

    adapter = new ApplicationLoggerAdapter(nestjsLogger, "TestApplication");
  });

  it("should set context from constructor", () => {
    expect(nestjsLogger.setContext).toHaveBeenCalledWith("TestApplication");
  });

  it("should pass debug message to NestjsLogger", () => {
    adapter.debug("Test debug message", { test: "data" });
    expect(nestjsLogger.debug).toHaveBeenCalledWith({
      message: "Test debug message",
      test: "data",
    });
  });

  it("should pass info message to NestjsLogger", () => {
    adapter.info("Test info message", { test: "data" });
    expect(nestjsLogger.info).toHaveBeenCalledWith({
      message: "Test info message",
      test: "data",
    });
  });

  it("should pass warn message to NestjsLogger", () => {
    adapter.warn("Test warn message", { test: "data" });
    expect(nestjsLogger.warn).toHaveBeenCalledWith({
      message: "Test warn message",
      test: "data",
    });
  });

  it("should pass error message to NestjsLogger", () => {
    const error = new Error("Test error");
    adapter.error("Test error message", error, { test: "data" });
    expect(nestjsLogger.error).toHaveBeenCalledWith({
      message: "Test error message",
      error,
      test: "data",
    });
  });

  it("should pass error message without error object to NestjsLogger", () => {
    adapter.error("Test error message", undefined, { test: "data" });
    expect(nestjsLogger.error).toHaveBeenCalledWith({
      message: "Test error message",
      test: "data",
    });
  });

  it("should pass fatal message to NestjsLogger", () => {
    const error = new Error("Test fatal error");
    adapter.fatal("Test fatal message", error, { test: "data" });
    expect(nestjsLogger.fatal).toHaveBeenCalledWith({
      message: "Test fatal message",
      error,
      test: "data",
    });
  });

  it("should pass fatal message without error object to NestjsLogger", () => {
    adapter.fatal("Test fatal message", undefined, { test: "data" });
    expect(nestjsLogger.fatal).toHaveBeenCalledWith({
      message: "Test fatal message",
      test: "data",
    });
  });
});
