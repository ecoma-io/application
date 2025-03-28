import { MailerModule } from "@ecoma/nestjs-mailer";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { EmailNotificationController } from "./email-notification.controller";
import { EmailNotificationWorker } from "./email-notification.worker";

@Module({
  imports: [
    MailerModule.register({
      smtp: {
        pool: true,
        url: process.env.SMTP_SERVER,
      },
      verifyOnInit: true,
    }),
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_SERVERS.split(","),
      connectionInitOptions: { wait: true },
    }),
  ],
  controllers: [EmailNotificationController],
  providers: [EmailNotificationWorker],
})
export class EmailNotificationModule {}
