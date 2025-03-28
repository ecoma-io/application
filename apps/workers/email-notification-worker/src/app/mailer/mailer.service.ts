import { NestjsLogger } from '@ecoma/nestjs-logging';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new NestjsLogger(MailerService.name);
  private readonly transporter: Transporter;

  constructor(private options: SMTPPool.Options) {
    this.transporter = createTransport(this.options);
  }

  async onModuleInit() {
    await Promise.race([
      this.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout connecting to SMTP server')), 30000)
      ),
    ]);
  }

  private async connect(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          await this.transporter.verify();
          this.logger.info('Successfully connected to SMTP');
          clearInterval(interval);
          resolve();
        } catch (error) {
          this.logger.error('Error connecting to SMTP server. Retrying later...', error);
        }
      }, 3000);
    });
  }

  getTransporter(): Transporter{
    return this.transporter;
  }

}
