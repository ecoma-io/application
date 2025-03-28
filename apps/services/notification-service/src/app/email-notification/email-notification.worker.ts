import { NestjsLogger } from "@ecoma/nestjs-logging";
import { MailerService } from "@ecoma/nestjs-mailer";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import Mail from "nodemailer/lib/mailer";

export const EmailNotificationQueue = "email-notification-queue";

@Injectable()
export class EmailNotificationWorker {
  private logger = new NestjsLogger(EmailNotificationWorker.name);

  constructor(private mailer: MailerService) {}

  @RabbitSubscribe({
    queue: EmailNotificationQueue,
    queueOptions: {
      durable: true,
      autoDelete: false,
    },
  })
  public async sendEmail(payload: Mail.Options) {
    this.logger.info({ payload, msg: "Sending email" });
    try {
      this.mailer.getTransporter().sendMail(payload);
    } catch (err) {
      this.logger.error({ msg: "Sending email error", err });
    }
  }
}
