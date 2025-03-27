import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import { InvalidLocaleError, InvalidNameError } from "../errors";
import {
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserEmailVerifiedEvent,
} from "../events";
import { Email, Password } from "../value-objects";

export interface IUserProps {
  id: SnowflakeId;
  email: Email;
  hashedPassword: Password;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  locale: string;
  lastLoginAt: Date | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a user in the system.
 * @extends {AbstractAggregate}
 */
export class User extends AbstractAggregate<SnowflakeId, IUserProps> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly SUPPORTED_LOCALES = ["en", "vi"];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly NAME_MIN_LENGTH = 1;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly NAME_MAX_LENGTH = 50;

  constructor(props: IUserProps) {
    User.validateName(props.firstName, "First name");
    User.validateName(props.lastName, "Last name");

    super(props);

    this.addDomainEvent(
      new UserCreatedEvent(this.id.toString(), this.props.email.value)
    );
  }

  get email(): Email {
    return this.props.email;
  }

  get hashedPassword(): Password {
    return this.props.hashedPassword;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get locale(): string {
    return this.props.locale;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Updates the user's basic information.
   */
  update(firstName: string, lastName: string): void {
    User.validateName(firstName, "First name");
    User.validateName(lastName, "Last name");

    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }

  /**
   * Updates the user's email.
   */
  updateEmail(email: Email): void {
    this.props.email = email;
    this.props.isEmailVerified = false;
    this.props.emailVerifiedAt = null;
    this.props.updatedAt = new Date();
  }

  /**
   * Updates the user's password.
   */
  updatePassword(hashedPassword: Password): void {
    this.props.hashedPassword = hashedPassword;
    this.props.updatedAt = new Date();
  }

  /**
   * Updates the user's locale.
   */
  updateLocale(locale: string): void {
    User.validateLocale(locale);
    this.props.locale = locale;
    this.props.updatedAt = new Date();
  }

  /**
   * Verifies the user's email.
   */
  verifyEmail(): void {
    this.props.isEmailVerified = true;
    this.props.emailVerifiedAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UserEmailVerifiedEvent(this.id.toString(), this.props.email.value)
    );
  }

  /**
   * Records a login attempt.
   */
  recordLogin(): void {
    this.props.lastLoginAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Activates the user.
   */
  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Deactivates the user.
   */
  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new UserDeactivatedEvent(this.id.toString()));
  }

  /**
   * Validates a name field.
   */
  private static validateName(name: string, field: string): void {
    if (
      name.length < User.NAME_MIN_LENGTH ||
      name.length > User.NAME_MAX_LENGTH
    ) {
      throw new InvalidNameError(
        field,
        name,
        User.NAME_MIN_LENGTH,
        User.NAME_MAX_LENGTH
      );
    }
  }

  /**
   * Validates a locale.
   */
  private static validateLocale(locale: string): void {
    if (!User.SUPPORTED_LOCALES.includes(locale)) {
      throw new InvalidLocaleError(locale);
    }
  }
}
