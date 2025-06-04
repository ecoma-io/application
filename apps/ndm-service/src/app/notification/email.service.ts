import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SmtpConfig } from '../config/smtp.config';
import { PinoLogger } from '@ecoma/nestjs-logger';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new PinoLogger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private smtpConfig: SmtpConfig;

  constructor(private readonly configService: ConfigService) {
    this.smtpConfig = this.configService.get<SmtpConfig>('smtp');
    this.transporter = nodemailer.createTransport({
      url: this.smtpConfig.uri,
      maxConnections: 5,
      pool: true,
    });
  }

  async onModuleInit() {
    this.logger.log('Verifying SMTP connection...');
    for (let i = 0; i < this.smtpConfig.retryAttempts; i++) {
      try {
        await this.transporter.verify();
        this.logger.log('SMTP connection verified successfully.');
        return;
      } catch (error) {
        this.logger.error(
          `SMTP connection verification failed (Attempt ${i + 1}/${this.smtpConfig.retryAttempts}): ${error.message}`,
        );
        if (i < this.smtpConfig.retryAttempts - 1) {
          this.logger.log(`Retrying in ${this.smtpConfig.retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, this.smtpConfig.retryDelay));
        } else {
          this.logger.error('Max retry attempts reached. SMTP connection failed.');
          throw new Error('Failed to connect to SMTP server after multiple retries.');
        }
      }
    }
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(options);
      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }
}
