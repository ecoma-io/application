import { User } from '@ecoma/iam-domain'; // Adjust path
import { IUserDto } from '../dtos/user.dto';

export class UserMapper {
  public static toDto(domainUser: User): IUserDto {
    return {
      id: domainUser.id,
      email: domainUser.email.value,
      firstName: domainUser.profile.firstName,
      lastName: domainUser.profile.lastName,
      locale: domainUser.profile.locale,
      status: domainUser.status.value,
    };
  }

  public static toPersistence(domainUser: User): any {
    // Map to a structure suitable for the chosen persistence layer (e.g., TypeORM entity props)
    // This might be more complex and reside in the infrastructure layer
    // or be used by a generic repository if common-infrastructure provides one.
    return {
      id: domainUser.id,
      email: domainUser.email.value,
      password_hash: domainUser.passwordHash.value,
      first_name: domainUser.profile.firstName,
      last_name: domainUser.profile.lastName,
      locale: domainUser.profile.locale,
      status: domainUser.status.value,
      password_reset_token: domainUser.passwordResetToken,
      password_reset_token_expires_at: domainUser.passwordResetTokenExpiresAt,
      email_verification_token: domainUser.emailVerificationToken,
      email_verification_token_expires_at: domainUser.emailVerificationTokenExpiresAt,
      created_at: domainUser.createdAt,
      updated_at: domainUser.updatedAt,
    };
  }

  // public static toDomain(persistenceObject: any): User {
  //   // This would be in the repository implementation in infrastructure
  // }
}
