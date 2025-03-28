export const COLOR = {
  GREEN: `\x1b[32m`,
  RED: `\x1b[31m`,
  WHITE: `\x1b[37m`,
  YELLOW: `\x1b[33m`,
  CYAN: `\x1b[36m`,
  CLEAR: `\x1b[0m`,
};

export const LEVEL_COLORS = {
  FATAL: COLOR.RED,
  ERROR: COLOR.RED,
  WARN: COLOR.YELLOW,
  INFO: COLOR.GREEN,
  DEBUG: COLOR.CYAN,
  TRACE: COLOR.WHITE,
};

export const CONSOLE_LEVEL_FUNCTION = {
  FATAL: "error",
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
  TRACE: "trace",
};

export function formatLogLevel(level: string): string {
  const levelUpper = level.toUpperCase();
  const color = LEVEL_COLORS[levelUpper as keyof typeof LEVEL_COLORS];
  return `${color}[${levelUpper}]${COLOR.CLEAR}`;
}

export function formatLogScope(scope?: string): string {
  return scope ? ` ${COLOR.CYAN}[${scope}]${COLOR.CLEAR} ` : " ";
}

export function getConsoleFunction(
  level: string
): "error" | "warn" | "info" | "debug" | "trace" {
  return CONSOLE_LEVEL_FUNCTION[
    level.toUpperCase() as keyof typeof CONSOLE_LEVEL_FUNCTION
  ] as "error" | "warn" | "info" | "debug" | "trace";
}
