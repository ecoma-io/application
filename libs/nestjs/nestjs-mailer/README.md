# 📬 @ecoma/nestjs-mailer

A simple and powerful email module for NestJS using `nodemailer`, with support for SMTP pool configuration, startup verification, and customizable retry logic.

## 🚀 Features

- Easy configuration via `MailerModule.register()`
- Supports SMTP pool (`SMTPPool.Options`)
- Optional SMTP verification on startup
- Customizable retry logic for verification

---

## 📦 Installation

```bash
yarn add @ecoma/nestjs-mailer
# or
npm install @ecoma/nestjs-mailer
```

---

## 🛠️ Usage

### 1. Register the module

```ts
// app.module.ts
import { MailerModule } from "@ecoma/nestjs-mailer";

@Module({
  imports: [
    MailerModule.register({
      smtp: {
        url: "smtps://username:password@smtp.example.com",
        pool: true,
        maxConnections: 5,
      },
      verifyOnInit: {
        retryInterval: 3000, // 3 seconds
        maxRetries: 5,
      },
    }),
  ],
})
export class AppModule {}
```

> `verifyOnInit` can also be `true` (defaults to 3s retry interval, 10 retries), or `false | undefined` to disable verification.

---

### 2. Send emails using the service

```ts
import { MailerService } from "@ecoma/nestjs-mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  constructor(private readonly mailer: MailerService) {}

  async sendWelcomeEmail(to: string) {
    const transporter = this.mailer.getTransporter();

    await transporter.sendMail({
      from: '"MyApp" <no-reply@myapp.com>',
      to,
      subject: "Welcome!",
      text: "Thanks for joining our platform.",
    });
  }
}
```

---

## 📄 Configuration Interfaces

```ts
export interface VerifyRetryOptions {
  retryInterval?: number; // milliseconds (default: 3000)
  maxRetries?: number; // (default: 10)
}

export interface MailerModuleOptions {
  smtp: SMTPPool.Options;
  verifyOnInit?: boolean | VerifyRetryOptions;
}
```
