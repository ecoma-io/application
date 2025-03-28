import { EnvironmentProviders, isDevMode, Provider } from "@angular/core";
import { provideLumberjack } from "@ngworker/lumberjack";
import { provideLumberjackConsoleDriver } from "@ngworker/lumberjack/console-driver";

export const provideLogging = (): Array<Provider | EnvironmentProviders> => {
  if (isDevMode()) {
    return [...provideLumberjack(), ...provideLumberjackConsoleDriver()];
  } else {
    return [
      ...provideLumberjack({ levels: ["warn", "error", "critical"] }),
      ...provideLumberjackConsoleDriver(),
    ];
  }
};
