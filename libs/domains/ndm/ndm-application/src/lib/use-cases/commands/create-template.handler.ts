import { ICommandHandler, ICommand } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import {
  ITemplateRepository,
  Template,
  Channel,
  Locale
} from '@ecoma/ndm-domain';
import { CreateTemplateDto } from '../../dtos';
import { Injectable } from '@nestjs/common';

/**
 * Command để tạo template mới
 */
export class CreateTemplateCommand implements ICommand {
  constructor(public readonly dto: CreateTemplateDto) {}
  public readonly version: string = '1';
}

/**
 * Command handler để tạo template mới
 */
@Injectable()
export class CreateTemplateHandler implements ICommandHandler<CreateTemplateCommand, string> {
  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command tạo template
   * @param command Command chứa thông tin tạo template
   * @returns ID của template mới được tạo
   */
  public async handle(command: CreateTemplateCommand): Promise<string> {
    const dto = command.dto;
    this.logger.info('Creating new template', { name: dto.name });

    // Tạo các value objects
    const channel = Channel.create(dto.channel);
    const locale = Locale.create(dto.locale);

    // Tạo template mới
    const template = Template.create(
      dto.name,
      dto.description,
      dto.subject,
      dto.content,
      channel,
      locale,
      dto.requiredContextKeys,
      dto.organizationId,
    );

    // Lưu template
    await this.templateRepository.save(template);

    const templateId = template.getId().toString();
    this.logger.info('Template created successfully', {
      templateId: templateId,
      name: dto.name,
      organizationId: dto.organizationId
    });

    return templateId;
  }
}
