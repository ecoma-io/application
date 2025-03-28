import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '@ecoma/common-application';
import { ITemplateRepository, Template, Channel } from '@ecoma/ndm-domain';
import { TemplateEntity } from '../entities';
import { TemplateMapper } from '../mappers';

/**
 * TypeORM implementation của ITemplateRepository
 */
@Injectable()
export class TemplateRepository implements ITemplateRepository {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly repository: Repository<TemplateEntity>,
    private readonly logger: ILogger,
  ) {}

  /**
   * Tìm template theo ID
   */
  public async findById(id: string): Promise<Template | null> {
    this.logger.debug('Finding template by ID', { id });

    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return TemplateMapper.toDomain(entity);
  }

  /**
   * Lưu template
   */
  public async save(template: Template): Promise<Template> {
    this.logger.debug('Saving template', { id: template.id });

    const entity = TemplateMapper.toPersistence(template);
    const savedEntity = await this.repository.save(entity);

    return TemplateMapper.toDomain(savedEntity);
  }

  /**
   * Tìm các template theo tổ chức và kênh gửi
   */
  public async findByOrganizationIdAndChannel(
    organizationId: string,
    channel: Channel,
  ): Promise<Template[]> {
    this.logger.debug('Finding templates by organization ID and channel', {
      organizationId,
      channel: channel.toString()
    });

    const entities = await this.repository.find({
      where: {
        organizationId,
        channel: channel.toString(),
      },
    });

    return entities.map(entity => TemplateMapper.toDomain(entity));
  }

  /**
   * Tìm các template theo tổ chức
   */
  public async findByOrganizationId(organizationId: string): Promise<Template[]> {
    this.logger.debug('Finding templates by organization ID', { organizationId });

    const entities = await this.repository.find({ where: { organizationId } });

    return entities.map(entity => TemplateMapper.toDomain(entity));
  }
}
