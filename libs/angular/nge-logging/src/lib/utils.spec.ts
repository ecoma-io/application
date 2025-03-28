/**
 * @fileoverview Unit test cho utils
 * @since 1.0.0
 */

import {
  COLOR,
  formatLogLevel,
  formatLogScope,
  getConsoleFunction,
} from "./utils";

describe("Logger Utils", () => {
  describe("formatLogLevel", () => {
    it("should format log levels correctly", () => {
      expect(formatLogLevel("INFO")).toBe(`${COLOR.green}[INFO]${COLOR.clear}`);
      expect(formatLogLevel("ERROR")).toBe(`${COLOR.red}[ERROR]${COLOR.clear}`);
      expect(formatLogLevel("WARN")).toBe(`${COLOR.yellow}[WARN]${COLOR.clear}`);
      expect(formatLogLevel("DEBUG")).toBe(`${COLOR.cyan}[DEBUG]${COLOR.clear}`);
      expect(formatLogLevel("TRACE")).toBe(`${COLOR.white}[TRACE]${COLOR.clear}`);
      expect(formatLogLevel("FATAL")).toBe(`${COLOR.red}[FATAL]${COLOR.clear}`);
    });

    it("should handle unknown log levels", () => {
      expect(formatLogLevel("UNKNOWN")).toBe(`[UNKNOWN]`);
    });
  });

  describe("formatLogScope", () => {
    it("should format scope correctly", () => {
      expect(formatLogScope("TestScope")).toBe(` ${COLOR.cyan}[TestScope]${COLOR.clear} `);
    });

    it("should handle empty scope", () => {
      expect(formatLogScope("")).toBe(" ");
    });

    it("should handle undefined scope", () => {
      expect(formatLogScope(undefined)).toBe(" ");
    });
  });

  describe("getConsoleFunction", () => {
    it("should return correct console function for each level", () => {
      expect(getConsoleFunction("debug")).toBe("debug");
      expect(getConsoleFunction("info")).toBe("info");
      expect(getConsoleFunction("warn")).toBe("warn");
      expect(getConsoleFunction("error")).toBe("error");
      expect(getConsoleFunction("trace")).toBe("trace");
      expect(getConsoleFunction("fatal")).toBe("error");
    });

    it("should default to log for unknown levels", () => {
      expect(getConsoleFunction("unknown")).toBe("log");
    });
  });
});
