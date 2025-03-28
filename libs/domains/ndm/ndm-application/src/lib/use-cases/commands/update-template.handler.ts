import { ICommandHandler, ICommand } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import {
  ITemplateRepository,
  StringId
} from '@ecoma/ndm-domain';
import { UpdateTemplateDto } from '../../dtos';
import { Injectable } from '@nestjs/common';

/**
 * Command để cập nhật template
 */
export class UpdateTemplateCommand implements ICommand {
  constructor(public readonly dto: UpdateTemplateDto) {}
  public readonly version: string = '1';
}

/**
 * Command handler để cập nhật template
 */
@Injectable()
export class UpdateTemplateHandler implements ICommandHandler<UpdateTemplateCommand, void> {
  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command cập nhật template
   * @param command Command chứa thông tin template cần cập nhật
   */
  public async handle(command: UpdateTemplateCommand): Promise<void> {
    const dto = command.dto;
    this.logger.info('Updating template', { templateId: dto.id });

    // Tìm template
    const templateId = StringId.create(dto.id);
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      this.logger.error('Template not found', { templateId: dto.id });
      throw new Error(`Template not found: ${dto.id}`);
    }

    // Cập nhật các thuộc tính
    if (dto.name) {
      template.updateName(dto.name);
    }

    if (dto.subject) {
      template.updateSubject(dto.subject);
    }

    if (dto.content) {
      template.updateContent(dto.content);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        template.activate();
      } else {
        template.deactivate();
      }
    }

    // Lưu template
    await this.templateRepository.save(template);

    this.logger.info('Template updated successfully', {
      templateId: template.getId().toString()
    });
  }
}
