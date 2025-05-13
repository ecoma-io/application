import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export enum InvitationStatusValues {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
}

interface IInvitationStatusProps {
  value: InvitationStatusValues;
}

export class InvitationStatus extends AbstractValueObject<IInvitationStatusProps> {
  get value(): InvitationStatusValues {
    return this.props.value;
  }

  public static readonly values = InvitationStatusValues;

  private constructor(props: IInvitationStatusProps) {
    super(props);
  }

  public static create(status: InvitationStatusValues): InvitationStatus {
    Guard.againstNullOrUndefined(status, 'status');
    return new InvitationStatus({ value: status });
  }

  public static createPending(): InvitationStatus {
    return this.create(InvitationStatusValues.PENDING);
  }

  public static createAccepted(): InvitationStatus {
    return this.create(InvitationStatusValues.ACCEPTED);
  }

  public static createRejected(): InvitationStatus {
    return this.create(InvitationStatusValues.REJECTED);
  }

  public static createExpired(): InvitationStatus {
    return this.create(InvitationStatusValues.EXPIRED);
  }

  public is(statusValue: InvitationStatusValues): boolean {
    return this.props.value === statusValue;
  }
}
