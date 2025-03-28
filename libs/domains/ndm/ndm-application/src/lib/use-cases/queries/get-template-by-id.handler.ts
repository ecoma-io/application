import { IQueryHandler, IQuery } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { ITemplateRepository, Template, StringId } from '@ecoma/ndm-domain';
import { Injectable } from '@nestjs/common';

/**
 * Query để lấy thông tin template theo ID
 */
export class GetTemplateByIdQuery implements IQuery {
  constructor(public readonly id: StringId) {}
  public readonly version: string = '1';
}

/**
 * Query handler để lấy thông tin template theo ID
 */
@Injectable()
export class GetTemplateByIdHandler implements IQueryHandler<GetTemplateByIdQuery, Template | null> {
  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy thông tin template
   * @param query Query chứa ID của template
   * @returns Template hoặc null nếu không tìm thấy
   */
  public async handle(query: GetTemplateByIdQuery): Promise<Template | null> {
    this.logger.info('Getting template by ID', { templateId: query.id });

    const template = await this.templateRepository.findById(query.id);

    if (!template) {
      this.logger.info('Template not found', { templateId: query.id });
    }

    return template;
  }
}
