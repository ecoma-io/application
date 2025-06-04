import { Injectable } from '@nestjs/common';
import { NotificationTemplateRepository } from '../database/repositories/notification-template.repository';
import { TemplateCreateDto, TemplateUpdateDto } from './template.dtos';
import { TemplateAlreadyExistsException, TemplateNotFoundException } from './template.errors';
import { PinoLogger } from '@ecoma/nestjs-logger';

@Injectable()
export class TemplateService {
  private readonly logger = new PinoLogger(TemplateService.name);

  constructor(private readonly templateRepo: NotificationTemplateRepository) {}

  async create(dto: TemplateCreateDto) {
    this.logger.log('create method entered');
    this.logger.debug('Attempting to create template', { name: dto.name });
    const existed = await this.templateRepo.findByName(dto.name);
    if (existed) {
      this.logger.warn(`Template with name ${dto.name} already exists`);
      throw new TemplateAlreadyExistsException();
    }
    const template = await this.templateRepo.create(dto);
    this.logger.info(`Successfully created template with name ${dto.name}`);
    return { success: true, data: template };
  }

  async findAll() {
    this.logger.log('findAll method entered');
    this.logger.debug('Attempting to find all templates');
    const templates = await this.templateRepo.findAll();
    this.logger.info(`Successfully found ${templates.length} templates`);
    return { success: true, data: templates };
  }

  async findByName(name: string) {
    this.logger.log('findByName method entered');
    this.logger.debug(`Attempting to find template by name: ${name}`);
    const template = await this.templateRepo.findByName(name);
    if (!template) {
      this.logger.warn(`Template with name ${name} not found`);
      throw new TemplateNotFoundException();
    }
    this.logger.info(`Successfully found template with name ${name}`);
    return { success: true, data: template };
  }

  async update(name: string, dto: TemplateUpdateDto) {
    this.logger.log('update method entered');
    this.logger.debug(`Attempting to update template with name: ${name}`, { updateData: dto });
    const updated = await this.templateRepo.updateByName(name, dto);
    if (!updated) {
      this.logger.warn(`Template with name ${name} not found for update`);
      throw new TemplateNotFoundException();
    }
    this.logger.info(`Successfully updated template with name ${name}`);
    return { success: true, data: updated };
  }

  async delete(name: string) {
    this.logger.log('delete method entered');
    this.logger.debug(`Attempting to delete template with name: ${name}`);
    const result = await this.templateRepo.deleteByName(name);
    if (!result.deletedCount) {
      this.logger.warn(`Template with name ${name} not found for deletion`);
      throw new TemplateNotFoundException();
    }
    this.logger.info(`Successfully deleted template with name ${name}`);
    return { success: true };
  }
}
