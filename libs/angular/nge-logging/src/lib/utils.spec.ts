import {
  COLOR,
  formatLogLevel,
  formatLogScope,
  getConsoleFunction,
} from "./utils";

describe("Logger Utils", () => {
  describe("formatLogLevel", () => {
    it("should format log level with correct color", () => {
      expect(formatLogLevel("INFO")).toBe(`${COLOR.GREEN}[INFO]${COLOR.CLEAR}`);
      expect(formatLogLevel("ERROR")).toBe(`${COLOR.RED}[ERROR]${COLOR.CLEAR}`);
      expect(formatLogLevel("DEBUG")).toBe(
        `${COLOR.CYAN}[DEBUG]${COLOR.CLEAR}`
      );
    });
  });

  describe("formatLogScope", () => {
    it("should format log scope with cyan color", () => {
      expect(formatLogScope("MyScope")).toBe(
        ` ${COLOR.CYAN}[MyScope]${COLOR.CLEAR} `
      );
    });

    it("should return empty string if scope is undefined", () => {
      expect(formatLogScope()).toBe(" ");
    });
  });

  describe("getConsoleFunction", () => {
    it("should return correct console function based on log level", () => {
      expect(getConsoleFunction("ERROR")).toBe("error");
      expect(getConsoleFunction("WARN")).toBe("warn");
      expect(getConsoleFunction("INFO")).toBe("info");
      expect(getConsoleFunction("DEBUG")).toBe("debug");
      expect(getConsoleFunction("TRACE")).toBe("trace");
    });

    it("should return undefined if log level is unknown", () => {
      expect(getConsoleFunction("UNKNOWN")).toBeUndefined();
    });
  });
});
