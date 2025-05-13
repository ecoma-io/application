import { User } from '../aggregates/user.aggregate';
import { EmailAddress } from '../value-objects/email-address.vo';
// Potentially: import { IBaseRepository } from '@ecoma/common-domain';

export interface IUserRepository /* extends IBaseRepository<User> */ {
  findById(id: string): Promise<User | null>;
  findByEmail(email: EmailAddress | string): Promise<User | null>;
  // findByEmailVerificationToken(token: string): Promise<User | null>;
  // findByPasswordResetToken(token: string): Promise<User | null>;
  save(user: User): Promise<void>;
  existsByEmail(email: EmailAddress | string): Promise<boolean>;
  delete(user: User): Promise<void>; // Or deleteById(id: string)
}

export const IUserRepository = Symbol('IUserRepository');
