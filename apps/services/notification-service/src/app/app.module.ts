import { Module } from "@nestjs/common";
import { EmailNotificationModule } from "./email-notification/email-notification.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [HealthModule, EmailNotificationModule],
})
export class AppModule {}
