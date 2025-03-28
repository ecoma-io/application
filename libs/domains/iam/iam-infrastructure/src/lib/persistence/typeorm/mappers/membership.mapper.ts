import { Membership } from '@ecoma/iam-domain';
import { MembershipEntity } from '../entities/membership.entity';

/**
 * Mapper cho Membership entity và TypeORM entity.
 */
export class MembershipMapper {
  /**
   * Chuyển đổi từ Membership entity sang TypeORM entity.
   * @param membership - Membership entity
   * @returns MembershipEntity - TypeORM entity
   */
  public static toPersistence(membership: Membership): MembershipEntity {
    const entity = new MembershipEntity();
    
    entity.id = membership.id;
    entity.userId = membership.userId;
    entity.organizationId = membership.organizationId;
    entity.roleId = membership.roleId;
    entity.joinedAt = membership.joinedAt;
    
    return entity;
  }

  /**
   * Chuyển đổi từ TypeORM entity sang Membership entity.
   * @param entity - TypeORM entity
   * @returns Membership - Membership entity
   */
  public static toDomain(entity: MembershipEntity): Membership {
    return Membership.restore({
      id: entity.id,
      userId: entity.userId,
      organizationId: entity.organizationId,
      roleId: entity.roleId,
      joinedAt: entity.joinedAt
    });
  }
} 