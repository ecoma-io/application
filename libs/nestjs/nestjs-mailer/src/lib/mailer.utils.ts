import { NestjsLogger } from "@ecoma/nestjs-logging";
import { Transporter } from "nodemailer";
import { VerifyRetryOptions } from "./mailer.options";

export function normalizeVerifyOptions(
  input: boolean | VerifyRetryOptions | undefined
): Required<VerifyRetryOptions> | null {
  if (!input) return null;
  if (input === true) return { retryInterval: 3000, maxRetries: 10 };

  return {
    retryInterval: input.retryInterval ?? 3000,
    maxRetries: input.maxRetries ?? 10,
  };
}

export async function waitForVerify(
  transporter: Transporter,
  logger: NestjsLogger,
  options: Required<VerifyRetryOptions>
): Promise<void> {
  let retries = 0;

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      if (retries >= options.maxRetries) {
        clearInterval(timer);
        return reject(
          new Error("Max retry attempts reached for SMTP connection")
        );
      }

      try {
        await transporter.verify();
        logger.info("Successfully connected to SMTP");
        clearInterval(timer);
        resolve();
      } catch (error) {
        logger.error("Error connecting to SMTP server. Retrying...", error);
        retries++;
      }
    }, options.retryInterval);
  });
}
