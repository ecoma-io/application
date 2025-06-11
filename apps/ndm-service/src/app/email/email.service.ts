import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SmtpConfig } from '../config/smtp.config';
import { PinoLogger } from '@ecoma/nestjs';
import { NotificationTemplate } from '../database/schemas/notification-template.schema';
import { NotificationTemplateRepository } from '../database/repositories/notification-template.repository';
import * as Handlebars from 'handlebars';
import { PlainObject } from '@ecoma/common';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new PinoLogger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private smtpConfig: SmtpConfig;

  constructor(private readonly configService: ConfigService, private readonly templateRepo: NotificationTemplateRepository,
  ) {
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

  async sendMail(template: string, data: PlainObject, email: string, subject: string) {
    try {
      const content = await this.renderEmailContent(template, data);
      const contentWithLayout = await this.renderEmailLayout(content, { subject, ...data });
      const info = await this.transporter.sendMail({
        html: contentWithLayout.html,
        text: contentWithLayout.text,
        subject,
        to: email,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }


  private async renderEmailContent(template: string, data: PlainObject): Promise<{ html: string, text: string }> {
    const otpTemplate = await this.getTemplate(template);
    const html = this.compileTemplate(otpTemplate.html, data);
    const text = this.compileTemplate(otpTemplate.text, data);
    this.logger.debug(`Content rendered (first 100 chars): ${html.substring(0, 100)}...`);
    return { html, text };
  }


  private async renderEmailLayout(content: { html: string, text: string }, data: PlainObject): Promise<{ html: string, text: string }> {
    // Get email layout
    const layoutTemplate = await this.getTemplate('email');
    const html = this.compileTemplate(layoutTemplate.html, { ...data, body: content.html });
    const text = this.compileTemplate(layoutTemplate.text, { ...data, body: content.text });
    this.logger.debug(`Final HTML rendered (first 100 chars): ${html.substring(0, 100)}...`);
    return { html, text };
  }

  /**
   * Lấy template từ database theo tên
   * @param {string} templateName - Tên của template cần lấy
   * @returns {Promise<NotificationTemplate>} Template document từ database
   * @throws {Error} Khi không tìm thấy template
   */
  private async getTemplate(templateName: string): Promise<NotificationTemplate> {
    this.logger.debug(`Fetching ${templateName} template`);
    const templateDoc = await this.templateRepo.findByName(templateName);
    if (!templateDoc) {
      this.logger.warn(`${templateName} template not found`);
      throw new Error(`${templateName} template not found`);
    }
    this.logger.debug(`Successfully fetched ${templateName} template`);
    return templateDoc;
  }



  /**
   * Compile template Handlebars với data được cung cấp
   * @param {string} template - Template string cần compile
   * @param {unknown} data - Data để render vào template
   * @returns {string} Template đã được render
   */
  private compileTemplate(template: string, data: unknown): string {
    const compiled = Handlebars.compile(template);
    return compiled(data);
  }
}
