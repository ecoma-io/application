import { User, EmailAddress, UserProfile } from '@ecoma/iam-domain';
import { UserEntity } from '../entities/user.entity';

/**
 * Mapper cho User aggregate và TypeORM entity.
 */
export class UserMapper {
  /**
   * Chuyển đổi từ User aggregate sang TypeORM entity.
   * @param user - User aggregate
   * @returns UserEntity - TypeORM entity
   */
  public static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    
    entity.id = user.id;
    entity.email = user.email.value;
    entity.passwordHash = user.passwordHash;
    entity.status = user.status;
    entity.firstName = user.profile.firstName;
    entity.lastName = user.profile.lastName;
    entity.locale = user.profile.locale;
    entity.passwordResetToken = user.passwordResetToken;
    entity.passwordResetTokenExpiresAt = user.passwordResetTokenExpiresAt;
    entity.emailVerificationToken = user.emailVerificationToken;
    entity.emailVerificationTokenExpiresAt = user.emailVerificationTokenExpiresAt;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    
    return entity;
  }

  /**
   * Chuyển đổi từ TypeORM entity sang User aggregate.
   * @param entity - TypeORM entity
   * @returns User - User aggregate
   */
  public static toDomain(entity: UserEntity): User {
    const emailAddress = new EmailAddress(entity.email);
    const profile = new UserProfile(entity.firstName, entity.lastName, entity.locale);
    
    return User.restore({
      id: entity.id,
      email: emailAddress,
      passwordHash: entity.passwordHash,
      status: entity.status,
      profile: profile,
      passwordResetToken: entity.passwordResetToken,
      passwordResetTokenExpiresAt: entity.passwordResetTokenExpiresAt,
      emailVerificationToken: entity.emailVerificationToken,
      emailVerificationTokenExpiresAt: entity.emailVerificationTokenExpiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 