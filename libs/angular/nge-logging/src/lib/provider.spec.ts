import { isPlatformBrowser } from "@angular/common";
import { isDevMode } from "@angular/core";
import { provideLumberjack } from "@ngworker/lumberjack";
import { provideLumberjackConsoleDriver } from "@ngworker/lumberjack/console-driver";
import { provideLogging } from "./provider";

jest.mock("@angular/common", () => ({
  isPlatformBrowser: jest.fn(),
}));

jest.mock("@angular/core", () => ({
  isDevMode: jest.fn(),
  provideAppInitializer: jest.fn((fn) => [
    { provide: "APP_INITIALIZER", useFactory: fn, multi: true },
  ]),
}));

jest.mock("@ngworker/lumberjack", () => ({
  provideLumberjack: jest.fn(() => ["mockLumberjack"]),
}));

jest.mock("@ngworker/lumberjack/console-driver", () => ({
  provideLumberjackConsoleDriver: jest.fn(() => ["mockConsoleDriver"]),
}));

describe("provideLogging", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call provideLumberjack and provideLumberjackConsoleDriver in development mode", () => {
    (isDevMode as jest.Mock).mockReturnValue(true);

    const providers = provideLogging();

    expect(provideLumberjack).toHaveBeenCalled();
    expect(provideLumberjackConsoleDriver).toHaveBeenCalled();
    expect(providers).toContainEqual("mockLumberjack");
    expect(providers).toContainEqual("mockConsoleDriver");
  });

  test("should call provideLumberjack with limited levels in production mode", () => {
    (isDevMode as jest.Mock).mockReturnValue(false);
    (isPlatformBrowser as jest.Mock).mockReturnValue(false);

    const providers = provideLogging();

    expect(provideLumberjack).toHaveBeenCalledWith({
      levels: ["warn", "error", "critical"],
    });
    expect(provideLumberjackConsoleDriver).toHaveBeenCalled();
    expect(providers).toContainEqual("mockLumberjack");
    expect(providers).toContainEqual("mockConsoleDriver");
  });
});
