import { Session } from '@ecoma/iam-domain';
import { StringId } from '@ecoma/iam-domain';
import { SessionEntity } from '../entities/session.entity';

/**
 * Mapper chuyển đổi giữa Session domain entity và SessionEntity persistence model.
 */
export class SessionMapper {
  /**
   * Chuyển đổi từ persistence model sang domain entity.
   * @param entity - SessionEntity persistence model
   * @returns Session - Domain entity
   */
  public static toDomain(entity: SessionEntity): Session {
    return new Session(
      entity.id,
      entity.userId,
      entity.organizationId || null,
      entity.token,
      entity.expiresAt,
      entity.createdAt,
      entity.lastActiveAt
    );
  }

  /**
   * Chuyển đổi từ domain entity sang persistence model.
   * @param domain - Session domain entity
   * @returns SessionEntity - Persistence model
   */
  public static toPersistence(domain: Session): SessionEntity {
    const entity = new SessionEntity();
    entity.id = domain.id.toString();
    entity.userId = domain.getUserId;
    entity.organizationId = domain.getOrganizationId || undefined;
    entity.token = domain.getToken;
    entity.expiresAt = domain.getExpiresAt;
    entity.createdAt = domain.getCreatedAt;
    entity.lastActiveAt = domain.getLastActiveAt;
    return entity;
  }
}
