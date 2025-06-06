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
    const filePath = join(assetDir, 'email.hbs');

    if (!existsSync(filePath)) {
      throw new Error(`Email template file not found at path: ${filePath}`);
    }

    try {
      const bodyHtml = await fs.readFile(filePath, 'utf8');
      await this.templateRepo.create({
        name: templateName,
        bodyHtml,
        placeholders: ['body'],
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
    const filePath = join(assetDir, 'otp-email-html.hbs');

    if (!existsSync(filePath)) {
      throw new Error(`Email template file not found at path: ${filePath}`);
    }

    try {
      const bodyHtml = await fs.readFile(filePath, 'utf8');
      await this.templateRepo.create({
        name: templateName,
        bodyHtml,
        placeholders: ['firstName', 'otp', 'expireMinutes'],
        description: 'OTP email template',
      });
      this.logger.log(`Seeded template '${templateName}' successfully.`);
    } catch (err) {
      this.logger.error('Failed to seed otp email template:', err);
      throw err;
    }
  }
}
