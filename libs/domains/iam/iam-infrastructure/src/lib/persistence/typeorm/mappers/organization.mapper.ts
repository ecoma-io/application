import { Organization, OrganizationSlug } from '@ecoma/iam-domain';
import { OrganizationEntity } from '../entities/organization.entity';

/**
 * Mapper cho Organization aggregate và TypeORM entity.
 */
export class OrganizationMapper {
  /**
   * Chuyển đổi từ Organization aggregate sang TypeORM entity.
   * @param organization - Organization aggregate
   * @returns OrganizationEntity - TypeORM entity
   */
  public static toPersistence(organization: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    
    entity.id = organization.id;
    entity.name = organization.name;
    entity.slug = organization.slug.value;
    entity.status = organization.status;
    entity.country = organization.country;
    entity.logoAssetId = organization.logoAssetId;
    entity.createdAt = organization.createdAt;
    entity.updatedAt = organization.updatedAt;
    
    return entity;
  }

  /**
   * Chuyển đổi từ TypeORM entity sang Organization aggregate.
   * @param entity - TypeORM entity
   * @param members - Members (nếu có)
   * @returns Organization - Organization aggregate
   */
  public static toDomain(entity: OrganizationEntity, members = []): Organization {
    const slug = new OrganizationSlug(entity.slug);
    
    return Organization.restore({
      id: entity.id,
      name: entity.name,
      slug: slug,
      status: entity.status,
      country: entity.country,
      logoAssetId: entity.logoAssetId,
      members: members,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 