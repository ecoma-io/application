import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationTemplateRepository } from '../database/repositories/notification-template.repository';
import { join } from 'path';
import { existsSync, promises as fs } from 'fs';
import { PinoLogger } from '@ecoma/nestjs';

@Injectable()
export class TemplateSeedingService implements OnModuleInit {
  private readonly logger = new PinoLogger(TemplateSeedingService.name);
  constructor(private readonly templateRepo: NotificationTemplateRepository) { }

  async onModuleInit() {
    await this.seedingEmailTemplate();
    await this.seedingOtpEmailTemplate();
  }

  async seedingEmailTemplate() {
    const templateName = 'email';
    const existed = await this.templateRepo.findByName(templateName);
    if (existed) {
      this.logger.log(`Template '${templateName}' already exists, skip seeding.`);
      return;
    }
    const assetDir = existsSync(join(__dirname, 'assets')) ? join(__dirname, 'assets') : join(__dirname, '../../assets');
    const htmlFilePath = join(assetDir, 'email-html.hbs');
    const textFilePath = join(assetDir, 'email-text.hbs');

    if (!existsSync(htmlFilePath)) {
      throw new Error(`Email html layout template file not found at path: ${htmlFilePath}`);
    } else if (!existsSync(textFilePath)) {
      throw new Error(`Email text layout template file not found at path: ${textFilePath}`);
    }

    try {
      const html = await fs.readFile(htmlFilePath, 'utf8');
      const text = await fs.readFile(textFilePath, 'utf8');
      await this.templateRepo.create({
        name: templateName,
        html,
        text,
        placeholders: ['body', 'subject', 'email', 'firstName', 'lastName'],
        description: 'Common layout for all emails',
      });
      this.logger.log(`Seeded template '${templateName}' successfully.`);
    } catch (err) {
      this.logger.error('Failed to seed email template:', err);
      throw err;
    }
  }

  async seedingOtpEmailTemplate() {
    const templateName = 'otp-email';
    const existed = await this.templateRepo.findByName(templateName);
    if (existed) {
      this.logger.log(`Template '${templateName}' already exists, skip seeding.`);
      return;
    }
    const assetDir = existsSync(join(__dirname, 'assets')) ? join(__dirname, 'assets') : join(__dirname, '../../assets');
    const htmlFilePath = join(assetDir, 'otp-email-html.hbs');
    const textFilePath = join(assetDir, 'otp-email-text.hbs');

    if (!existsSync(htmlFilePath)) {
      throw new Error(`OTP email html template file not found at path: ${htmlFilePath}`);
    } else if (!existsSync(textFilePath)) {
      throw new Error(`OTP email text template file not found at path: ${textFilePath}`);
    }

    try {
      const html = await fs.readFile(htmlFilePath, 'utf8');
      const text = await fs.readFile(textFilePath, 'utf8');

      await this.templateRepo.create({
        name: templateName,
        html,
        text,
        placeholders: ['firstName', 'otp', 'expireMinutes', 'subject', 'email', 'firstName', 'lastName'],
        description: 'OTP email template',
      });

      this.logger.log(`Seeded template '${templateName}' successfully.`);
    } catch (err) {
      this.logger.error('Failed to seed otp email template:', err);
      throw err;
    }
  }
}
