import {
  ErrorCodes,
  errorResponse,
  StandardResponse,
  successResponse,
} from "@ecoma/base-constract";
import { NestjsLogger } from "@ecoma/nestjs-logging";
import { EmailNotificationConstractV1 } from "@ecoma/notification-constract";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import Mail from "nodemailer/lib/mailer";
import { EmailNotificationQueue } from "./email-notification.worker";

@Controller()
export class EmailNotificationController {
  private logger = new NestjsLogger(EmailNotificationController.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  @MessagePattern(EmailNotificationConstractV1.MessageParterns.SEND)
  async send(payload: Mail.Options): Promise<StandardResponse> {
    this.logger.info({
      msg: "Received send notification email request",
      payload,
    });
    try {
      const published = await this.amqpConnection.publish(
        "",
        EmailNotificationQueue,
        payload,
        { persistent: true }
      );
      if (published) {
        return successResponse();
      } else {
        return errorResponse(ErrorCodes.SYSTEM_ERROR, "Unkown Error");
      }
    } catch (err) {
      this.logger.error({ msg: "Error when push email to queue", err });
      return errorResponse(ErrorCodes.SYSTEM_ERROR, err.message, err);
    }
  }
}
