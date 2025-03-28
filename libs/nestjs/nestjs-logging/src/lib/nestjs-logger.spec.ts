import { NestjsLogger } from "./nestjs-logger";

describe("NestjsLogger", () => {
  let logger: NestjsLogger;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "log").mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe("Khởi tạo logger", () => {
    it("nên khởi tạo với cấu hình mặc định khi không có biến môi trường", () => {
      logger = new NestjsLogger("TestContext");
      expect(logger).toBeDefined();
      expect(logger.logger).toBeDefined();
    });

    it("nên sử dụng cấp độ log từ biến môi trường LOG_LEVEL", () => {
      process.env["LOG_LEVEL"] = "info";
      logger = new NestjsLogger("TestContext");
      expect(logger).toBeDefined();
    });

    it("nên sử dụng định dạng log từ biến môi trường LOG_FORMAT", () => {
      process.env["LOG_FORMAT"] = "text";
      logger = new NestjsLogger("TestContext");
      expect(logger).toBeDefined();
    });

    it("nên báo lỗi khi cấp độ log không hợp lệ", () => {
      process.env["LOG_LEVEL"] = "invalid";
      expect(() => new NestjsLogger("TestContext")).toThrow(
        "Invalid log level: invalid. Use 'trace', 'debug', 'info', 'warn', 'error', or 'fatal'"
      );
    });

    it("nên báo lỗi khi định dạng log không hợp lệ", () => {
      process.env["LOG_FORMAT"] = "invalid";
      expect(() => new NestjsLogger("TestContext")).toThrow(
        "Invalid log format: invalid. Use 'json' or 'text'"
      );
    });
  });

  describe("Các phương thức ghi log", () => {
    beforeEach(() => {
      process.env["LOG_LEVEL"] = "trace";
      logger = new NestjsLogger("TestContext");
      // Mock phương thức call để kiểm tra các tham số được gọi
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn<any, any>(logger, "call").mockImplementation(() => {});
    });

    it("nên gọi phương thức call với cấp độ trace khi gọi logger.trace", () => {
      logger.trace("Thông điệp trace");
      expect(logger["call"]).toHaveBeenCalledWith("trace", "Thông điệp trace");
    });

    it("nên gọi phương thức call với cấp độ debug khi gọi logger.debug", () => {
      logger.debug("Thông điệp debug");
      expect(logger["call"]).toHaveBeenCalledWith("debug", "Thông điệp debug");
    });

    it("nên gọi phương thức call với cấp độ info khi gọi logger.info", () => {
      logger.info("Thông điệp info");
      expect(logger["call"]).toHaveBeenCalledWith("info", "Thông điệp info");
    });

    it("nên gọi phương thức call với cấp độ info khi gọi logger.log", () => {
      logger.log("Thông điệp log");
      expect(logger["call"]).toHaveBeenCalledWith("info", "Thông điệp log");
    });

    it("nên gọi phương thức call với cấp độ warn khi gọi logger.warn", () => {
      logger.warn("Thông điệp warn");
      expect(logger["call"]).toHaveBeenCalledWith("warn", "Thông điệp warn");
    });

    it("nên gọi phương thức call với cấp độ error khi gọi logger.error", () => {
      logger.error("Thông điệp error");
      expect(logger["call"]).toHaveBeenCalledWith("error", "Thông điệp error");
    });

    it("nên gọi phương thức call với cấp độ fatal khi gọi logger.fatal", () => {
      logger.fatal("Thông điệp fatal");
      expect(logger["call"]).toHaveBeenCalledWith("fatal", "Thông điệp fatal");
    });

    it("nên xử lý thông tin context từ tham số cuối cùng", () => {
      // Mock lại call để kiểm tra logic bên trong
      jest.spyOn<any, any>(logger, "call").mockRestore();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger.logger, "info").mockImplementation(() => {});

      logger.info("Thông điệp với context", "CustomContext");

      expect(logger.logger.info).toHaveBeenCalled();
      const firstArg = (logger.logger.info as jest.Mock).mock.calls[0][0];
      expect(firstArg.context).toBe("CustomContext");
    });

    it("nên xử lý đúng khi message là một Error object", () => {
      // Mock lại call để kiểm tra logic bên trong
      jest.spyOn<any, any>(logger, "call").mockRestore();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger.logger, "error").mockImplementation(() => {});

      const error = new Error("Test error");
      logger.error(error);

      expect(logger.logger.error).toHaveBeenCalled();
      const firstArg = (logger.logger.error as jest.Mock).mock.calls[0][0];
      expect(firstArg.err).toBe(error);
    });
  });

  describe("Xử lý các trường hợp đặc biệt", () => {
    beforeEach(() => {
      logger = new NestjsLogger("TestContext");
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger.logger, "error").mockImplementation(() => {});
    });

    it("nên xử lý đúng định dạng lỗi từ ExceptionsHandler", () => {
      const errorMessage = "Test exception";
      const stackTrace = "\n  at TestController.method (/app/src/test.ts:10:5)";

      logger.error(errorMessage, stackTrace);

      expect(logger.logger.error).toHaveBeenCalled();
      const args = (logger.logger.error as jest.Mock).mock.calls[0];
      expect(args[0].err).toBeInstanceOf(Error);
      expect(args[0].err.message).toBe(errorMessage);
      expect(args[0].err.stack).toBe(stackTrace);
    });
  });
});
