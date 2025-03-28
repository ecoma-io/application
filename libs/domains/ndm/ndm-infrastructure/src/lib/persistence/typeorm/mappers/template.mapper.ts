import { Template, Channel, Locale } from '@ecoma/ndm-domain';
import { TemplateEntity } from '../entities';

/**
 * Mapper để chuyển đổi giữa Template domain model và TemplateEntity
 */
export class TemplateMapper {
  /**
   * Chuyển đổi từ domain model sang persistence model
   */
  public static toPersistence(template: Template): TemplateEntity {
    const entity = new TemplateEntity();
    entity.id = template.id;
    entity.name = template.name;
    entity.description = template.description;
    entity.channel = template.channel.toString();
    entity.subject = template.subject;
    entity.content = template.content;
    entity.locale = template.locale.toString();
    entity.organizationId = template.organizationId;
    entity.requiredContextKeys = template.requiredContextKeys;
    entity.isActive = template.isActive;
    return entity;
  }

  /**
   * Chuyển đổi từ persistence model sang domain model
   */
  public static toDomain(entity: TemplateEntity): Template {
    const channel = Channel.create(entity.channel);
    const locale = Locale.create(entity.locale);

    const template = new Template(
      entity.id,
      entity.name,
      entity.description,
      channel,
      entity.subject,
      entity.content,
      locale,
      entity.organizationId,
      entity.requiredContextKeys,
      entity.isActive,
    );

    return template;
  }
}
