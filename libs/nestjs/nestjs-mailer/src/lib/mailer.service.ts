import { NestjsLogger } from "@ecoma/nestjs-logging";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import { MAILER_CONFIG } from "./mailer.constants";
import { MailerModuleOptions } from "./mailer.options";
import { normalizeVerifyOptions, waitForVerify } from "./mailer.utils";

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new NestjsLogger(MailerService.name);
  private readonly transporter: Transporter;

  constructor(
    @Inject(MAILER_CONFIG) private readonly config: MailerModuleOptions
  ) {
    try {
      this.transporter = createTransport(this.config.smtp);
    } catch (error) {
      this.logger.error("Failed to create transporter", error);
      throw error;
    }
  }

  async onModuleInit() {
    const verifyOptions = normalizeVerifyOptions(this.config.verifyOnInit);
    if (!verifyOptions) return;

    await waitForVerify(this.transporter, this.logger, verifyOptions);
  }

  getTransporter(): Transporter {
    return this.transporter;
  }
}
