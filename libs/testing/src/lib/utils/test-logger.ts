export class TestLogger {

  static log(message: string) {
    process.stdout.write(`🟢 ${message.trim()}\n`);
  }

  static error(message: string, err?: unknown) {
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
    const line = "─".repeat(60);
    const formatted = title ? `📌 ${title.toUpperCase()}` : line;
    process.stdout.write(`\n${line}\n${formatted}\n${line}\n`);
  }
}
