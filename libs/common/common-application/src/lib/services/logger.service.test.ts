/**
 * @fileoverview Unit test cho LoggerService
 */
import { LoggerService } from "./logger.service";

describe("LoggerService", () => {
  let logger: LoggerService;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new LoggerService();
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("nên log thông tin với info()", () => {
    logger.info("test info");
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("[INFO] test info"));
  });

  it("nên log cảnh báo với warn()", () => {
    logger.warn("test warn");
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("[WARN] test warn"));
  });

  it("nên log lỗi với error()", () => {
    logger.error("test error");
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("[ERROR] test error"));
  });

  it("nên log debug với debug()", () => {
    logger.debug("test debug");
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG] test debug"));
  });
}); 