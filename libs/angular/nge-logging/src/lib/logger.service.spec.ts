import { TestBed } from "@angular/core/testing";
import { MockFactory } from "@ecoma/common-testing";
import { Logger } from "pino";
import {
  LoggerService,
  PINO_LOGGER,
  provideLoggerScope,
} from "./logger.service";

// Mock Pino Logger
const mockLogger: Partial<Logger> = {
  trace: MockFactory.createMockFn(),
  debug: MockFactory.createMockFn(),
  info: MockFactory.createMockFn(),
  warn: MockFactory.createMockFn(),
  error: MockFactory.createMockFn(),
  fatal: MockFactory.createMockFn(),
  child: MockFactory.createMockFn().mockImplementation(() => mockLogger),
};

describe("LoggerService", () => {
  describe("without logger and scope", () => {
    let service: LoggerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [LoggerService],
      });
      service = TestBed.inject(LoggerService);
    });

    it("should create an instance", () => {
      expect(service).toBeTruthy();
    });
  });

  describe("with provided logger", () => {
    let service: LoggerService;
    let loggerSpy: jest.Mocked<Logger>;

    beforeEach(() => {
      loggerSpy = mockLogger as jest.Mocked<Logger>;
      TestBed.configureTestingModule({
        providers: [
          LoggerService,
          { provide: PINO_LOGGER, useValue: loggerSpy },
        ],
      });
      service = TestBed.inject(LoggerService);
    });

    it("should use provided logger instance", () => {
      expect((service as any).logger).toBe(loggerSpy);
    });
  });

  describe("with provided scope", () => {
    let loggerSpy: jest.Mocked<Logger>;

    beforeEach(() => {
      loggerSpy = mockLogger as jest.Mocked<Logger>;
      TestBed.configureTestingModule({
        providers: [
          LoggerService,
          { provide: PINO_LOGGER, useValue: loggerSpy },
          provideLoggerScope("TestScope"),
        ],
      });
      TestBed.inject(LoggerService);
    });

    it("should create a scoped logger", () => {
      expect(loggerSpy.child).toHaveBeenCalledWith({ scope: "TestScope" });
    });
  });

  describe("create method", () => {
    let service: LoggerService;
    let loggerSpy: jest.Mocked<Logger>;

    beforeEach(() => {
      loggerSpy = mockLogger as jest.Mocked<Logger>;
      TestBed.configureTestingModule({
        providers: [
          LoggerService,
          { provide: PINO_LOGGER, useValue: loggerSpy },
        ],
      });
      service = TestBed.inject(LoggerService);
    });

    it("should create a new LoggerService instance with a new scope", () => {
      const newScope = "NewScope";
      const newLoggerService = service.create(newScope);

      expect(loggerSpy.child).toHaveBeenCalledWith({ scope: newScope });
      expect(newLoggerService).not.toBe(service);
    });
  });

  describe("logging methods", () => {
    let service: LoggerService;
    let loggerSpy: jest.Mocked<Logger>;

    beforeEach(() => {
      loggerSpy = mockLogger as jest.Mocked<Logger>;
      TestBed.configureTestingModule({
        providers: [
          LoggerService,
          { provide: PINO_LOGGER, useValue: loggerSpy },
        ],
      });
      service = TestBed.inject(LoggerService);
    });

    const logMethods: {
      method: keyof LoggerService;
      spy: keyof Logger;
      args: any[];
    }[] = [
      { method: "trace", spy: "trace", args: ["Test trace", { key: "value" }] },
      { method: "debug", spy: "debug", args: ["Debug message"] },
      {
        method: "info",
        spy: "info",
        args: ["Info message", { key: "value", k3: "valu3" }],
      },
      { method: "warn", spy: "warn", args: ["Warning message"] },
      {
        method: "error",
        spy: "error",
        args: ["Error occurred", new Error("Test Error")],
      },
      { method: "fatal", spy: "fatal", args: ["Fatal error", { crash: true }] },
    ];

    logMethods.forEach(({ method, spy, args }) => {
      it(`should call ${method} method on logger with transformed arguments`, () => {
        (service as any)[method](...args);
        expect(loggerSpy[spy]).toHaveBeenCalledWith(args[1] ?? {}, args[0]);
      });
    });
  });
});
