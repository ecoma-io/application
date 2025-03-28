import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MailerModule } from "./mailer/mailer.module";

@Module({
  imports: [
    TerminusModule,
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_SERVERS.split(","),
      connectionInitOptions: { wait: true },
    }),
    MailerModule.register(process.env.SMTP_SERVER)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
