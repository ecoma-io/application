export const COLOR = {
  green: `\x1b[32m`,
  red: `\x1b[31m`,
  white: `\x1b[37m`,
  yellow: `\x1b[33m`,
  cyan: `\x1b[36m`,
  clear: `\x1b[0m`,
};

export const LEVEL_COLORS = {
  fatal: COLOR.red,
  error: COLOR.red,
  warn: COLOR.yellow,
  info: COLOR.green,
  debug: COLOR.cyan,
  trace: COLOR.white,
};

type ConsoleFunction = "error" | "warn" | "info" | "debug" | "trace" | "log";

export const CONSOLE_LEVEL_FUNCTION: Record<string, ConsoleFunction> = {
  fatal: "error",
  error: "error",
  warn: "warn",
  info: "info",
  debug: "debug",
  trace: "trace",
} as const;

export function formatLogLevel(level: string): string {
  const levelLower = level.toLowerCase();
  const color = LEVEL_COLORS[levelLower as keyof typeof LEVEL_COLORS];
  return color ? `${color}[${level.toUpperCase()}]${COLOR.clear}` : `[${level.toUpperCase()}]`;
}

export function formatLogScope(scope?: string): string {
  return scope ? ` ${COLOR.cyan}[${scope}]${COLOR.clear} ` : " ";
}

export function getConsoleFunction(level: string): ConsoleFunction {
  const levelLower = level.toLowerCase();
  return CONSOLE_LEVEL_FUNCTION[levelLower] || "log";
}
