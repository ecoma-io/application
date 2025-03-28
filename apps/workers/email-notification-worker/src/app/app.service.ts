import { NestjsLogger } from "@ecoma/nestjs-logging";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { MailerService } from "./mailer/mailer.service";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class AppService {
  private readonly logger = new NestjsLogger(AppService.name);

  constructor(private mailer: MailerService) { }

  @RabbitSubscribe({ queue: "email-notification-queue" })
  async sendEmail(payload: Mail.Options) {
    this.logger.info({ msg: "Sending email", payload });
    try {
      await this.mailer.getTransporter().sendMail(payload);
      this.logger.info("Email sent successfully");
    } catch (error) {
      this.logger.error("Failed to send email", error);
    }
  }

}
