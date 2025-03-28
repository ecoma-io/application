import { IQueryHandler, IQuery } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { ITemplateRepository, Template, Channel } from '@ecoma/ndm-domain';
import { Injectable } from '@nestjs/common';

/**
 * Query để lấy danh sách template của một tổ chức
 */
export class GetTemplatesByOrganizationQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly channel?: string
  ) {}
  public readonly version: string = '1';
}

/**
 * Query handler để lấy danh sách template của một tổ chức
 */
@Injectable()
export class GetTemplatesByOrganizationHandler implements IQueryHandler<GetTemplatesByOrganizationQuery, Template[]> {
  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy danh sách template
   * @param query Query chứa organizationId và channel (tùy chọn)
   * @returns Danh sách template
   */
  public async handle(query: GetTemplatesByOrganizationQuery): Promise<Template[]> {
    const { organizationId, channel } = query;

    this.logger.info('Getting templates by organization', {
      organizationId,
      channel
    });

    let templates: Template[];

    if (channel) {
      const channelVO = Channel.create(channel);
      templates = await this.templateRepository.findByOrganizationIdAndChannel(
        organizationId,
        channelVO,
      );
    } else {
      templates = await this.templateRepository.findByOrganizationId(organizationId);
    }

    this.logger.info('Found templates', {
      organizationId,
      channel,
      count: templates.length
    });

    return templates;
  }
}
