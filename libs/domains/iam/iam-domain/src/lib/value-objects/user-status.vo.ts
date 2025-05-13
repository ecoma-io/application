import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export enum UserStatusValues {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING_CONFIRMATION = 'PendingConfirmation',
  PASSWORD_RESET_REQUESTED = 'PasswordResetRequested',
}

interface IUserStatusProps {
  value: UserStatusValues;
}

export class UserStatus extends AbstractValueObject<IUserStatusProps> {
  get value(): UserStatusValues {
    return this.props.value;
  }

  public static readonly values = UserStatusValues;

  private constructor(props: IUserStatusProps) {
    super(props);
  }

  public static create(value: UserStatusValues): UserStatus {
    Guard.againstNullOrUndefined(value, 'value');
    return new UserStatus({ value });
  }

  public static createActive(): UserStatus {
    return this.create(UserStatusValues.ACTIVE);
  }

  public static createInactive(): UserStatus {
    return this.create(UserStatusValues.INACTIVE);
  }

  public static createPendingConfirmation(): UserStatus {
    return this.create(UserStatusValues.PENDING_CONFIRMATION);
  }

  public static createPasswordResetRequested(): UserStatus {
    return this.create(UserStatusValues.PASSWORD_RESET_REQUESTED);
  }

  public is(status: UserStatusValues): boolean {
    return this.props.value === status;
  }
}
