import isCi from "is-ci";
// test-utils/test-logger.ts
export class TestLogger {
  private static shouldLog = !isCi;

  static log(message: string) {
    if (this.shouldLog) {
      process.stdout.write(`🟢 ${message.trim()}\n`);
    }
  }

  static error(message: string, err?: unknown) {
    if (!this.shouldLog) return;
    process.stderr.write(`🔴 ${message.trim()}\n`);
    if (err instanceof Error) {
      process.stderr.write(`${err.stack ?? err.message}\n`);
    } else if (typeof err === "object") {
      process.stderr.write(`${JSON.stringify(err, null, 2)}\n`);
    } else if (err) {
      process.stderr.write(`${String(err)}\n`);
    }
  }

  static divider(title?: string) {
    if (!this.shouldLog) return;
    const line = "─".repeat(60);
    const formatted = title ? `📌 ${title.toUpperCase()}` : line;
    process.stdout.write(`\n${line}\n${formatted}\n${line}\n`);
  }
}
