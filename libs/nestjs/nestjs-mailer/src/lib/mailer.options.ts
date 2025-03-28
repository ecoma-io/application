import SMTPPool from "nodemailer/lib/smtp-pool";

export interface VerifyRetryOptions {
  retryInterval?: number; // milliseconds
  maxRetries?: number;
}

export interface MailerModuleOptions {
  smtp: SMTPPool.Options;
  verifyOnInit?: boolean | VerifyRetryOptions;
}
