import { AbstractAggregate, AbstractDomainEvent, UuidId } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';
import { EmailAddress } from '../value-objects/email-address.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';
import { UserStatus, UserStatusValues } from '../value-objects/user-status.vo';
import { UserProfile } from '../value-objects/user-profile.vo';

export interface IUserProps {
  email: EmailAddress;
  passwordHash: PasswordHash;
  profile: UserProfile;
  status: UserStatus;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AbstractAggregate<UuidId> {
  private readonly _props: IUserProps;

  get email(): EmailAddress { return this._props.email; }
  get passwordHash(): PasswordHash { return this._props.passwordHash; }
  get status(): UserStatus { return this._props.status; }
  get profile(): UserProfile { return this._props.profile; }
  get passwordResetToken(): string | undefined { return this._props.passwordResetToken; }
  get passwordResetTokenExpiresAt(): Date | undefined { return this._props.passwordResetTokenExpiresAt; }
  get emailVerificationToken(): string | undefined { return this._props.emailVerificationToken; }
  get emailVerificationTokenExpiresAt(): Date | undefined { return this._props.emailVerificationTokenExpiresAt; }
  get createdAt(): Date { return this._props.createdAt; }
  get updatedAt(): Date { return this._props.updatedAt; }

  public changePassword(newPasswordHash: PasswordHash): void {
    Guard.againstNullOrUndefined(newPasswordHash, 'newPasswordHash');
    this._props.passwordHash = newPasswordHash;
    this._props.updatedAt = new Date();
    // TODO: Add PasswordChangedEvent
    // this.addDomainEvent(new PasswordChangedEvent(this.id.value));
  }

  public updateProfile(newProfile: UserProfile): void {
    Guard.againstNullOrUndefined(newProfile, 'newProfile');
    this._props.profile = newProfile;
    this._props.updatedAt = new Date();
    // TODO: Add UserProfileUpdatedEvent
  }

  public activate(): void {
    if (this._props.status.is(UserStatusValues.ACTIVE)) {
        // Optional: throw new DomainError('User is already active.'); or just return
        return;
    }
    this._props.status = UserStatus.createActive();
    this._props.updatedAt = new Date();
    // TODO: Add UserActivatedEvent
  }

  public deactivate(): void {
    if (this._props.status.is(UserStatusValues.INACTIVE)) {
        return;
    }
    this._props.status = UserStatus.createInactive();
    this._props.updatedAt = new Date();
    // TODO: Add UserDeactivatedEvent
  }

  public initiatePasswordReset(token: string, expiresAt: Date): void {
    this._props.passwordResetToken = token;
    this._props.passwordResetTokenExpiresAt = expiresAt;
    this._props.status = UserStatus.createPasswordResetRequested();
    this._props.updatedAt = new Date();
    // TODO: Add PasswordResetInitiatedEvent
  }

  public completePasswordReset(): void {
    this._props.passwordResetToken = undefined;
    this._props.passwordResetTokenExpiresAt = undefined;
    this._props.status = UserStatus.createActive(); // Or previous status if needed
    this._props.updatedAt = new Date();
    // TODO: Add PasswordResetCompletedEvent
  }

  public initiateEmailVerification(token: string, expiresAt: Date): void {
    if(this._props.status.is(UserStatusValues.ACTIVE)) {
        // Optional: throw domain error or log, user already active
        return;
    }
    this._props.emailVerificationToken = token;
    this._props.emailVerificationTokenExpiresAt = expiresAt;
    // Status remains PendingConfirmation or set explicitly if needed
    this._props.updatedAt = new Date();
    // TODO: Add EmailVerificationInitiatedEvent
  }

  public completeEmailVerification(): void {
    if(this._props.status.is(UserStatusValues.ACTIVE)) {
        return; // Already verified and active
    }
    this._props.emailVerificationToken = undefined;
    this._props.emailVerificationTokenExpiresAt = undefined;
    this._props.status = UserStatus.createActive();
    this._props.updatedAt = new Date();
    // TODO: Add EmailVerifiedEvent
  }

  private constructor(props: IUserProps, id: UuidId) {
    super(id);
    this._props = props;
  }

  public static create(props: {
    email: EmailAddress;
    passwordHash: PasswordHash;
    profile: UserProfile;
  }): User {
    const id = UuidId.create();
    const now = new Date();

    return new User({
      email: props.email,
      passwordHash: props.passwordHash,
      profile: props.profile,
      status: UserStatus.createPendingConfirmation(),
      createdAt: now,
      updatedAt: now,
    }, id);
  }
}
