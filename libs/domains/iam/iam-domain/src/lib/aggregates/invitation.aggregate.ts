import { AbstractAggregate, UuidId } from '@ecoma/common-domain'; // Adjusted path, assuming UuidId from common-domain
import { Guard } from '@ecoma/common-utils';
import { EmailAddress, InvitationStatus, InvitationStatusValues } from '../value-objects';

export interface IInvitationProps {
  readonly organizationId: string;
  readonly inviteeEmail: EmailAddress;
  readonly inviterUserId: string;
  readonly roleId: string;
  status: InvitationStatus; // Status can change
  token: string; // Token can change on resend
  expiresAt: Date; // ExpiresAt can change on resend
  readonly createdAt: Date;
  // updatedAt?: Date; // Optional: if you need to track updates to the invitation itself
}


export class Invitation extends AbstractAggregate<UuidId> {
  private props: IInvitationProps; // Made props mutable within the aggregate

  private constructor(props: IInvitationProps, id: UuidId) {
    super(id);
    this.props = props;
  }

  public static create(props: Omit<IInvitationProps, 'createdAt' | 'status'>, id: UuidId): Invitation {
    Guard.againstNullOrUndefined(props.organizationId, 'organizationId');
    Guard.againstEmptyString(props.organizationId, 'organizationId');
    Guard.againstNullOrUndefined(props.inviteeEmail, 'inviteeEmail');
    Guard.againstNullOrUndefined(props.inviterUserId, 'inviterUserId');
    Guard.againstEmptyString(props.inviterUserId, 'inviterUserId');
    Guard.againstNullOrUndefined(props.roleId, 'roleId');
    Guard.againstEmptyString(props.roleId, 'roleId');
    Guard.againstNullOrUndefined(props.token, 'token');
    Guard.againstEmptyString(props.token, 'token');
    Guard.againstNullOrUndefined(props.expiresAt, 'expiresAt');

    if (props.expiresAt <= new Date()) {
      // Consider DomainError from @ecoma/common-domain if available and appropriate
      throw new Error('Invitation expiry date must be in the future.');
    }

    const invitationProps: IInvitationProps = {
      ...props,
      status: InvitationStatus.createPending(),
      createdAt: new Date(),
    };
    const invitation = new Invitation(invitationProps, id);
    // Example: invitation.addDomainEvent(new InvitationCreatedEvent(invitation.id.value, props.organizationId, props.inviteeEmail.value, props.roleId));
    return invitation;
  }

  public static hydrate(props: IInvitationProps, id: UuidId): Invitation {
    return new Invitation(props, id);
  }

  get organizationId(): string { return this.props.organizationId; }
  get inviteeEmail(): EmailAddress { return this.props.inviteeEmail; }
  get inviterUserId(): string { return this.props.inviterUserId; }
  get roleId(): string { return this.props.roleId; }
  get status(): InvitationStatus { return this.props.status; }
  get token(): string { return this.props.token; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get createdAt(): Date { return this.props.createdAt; }

  public accept(): void {
    if (!this.props.status.is(InvitationStatusValues.PENDING)) {
      throw new Error('Invitation cannot be accepted as it is not in pending state.');
    }
    if (this.props.expiresAt <= new Date()) {
      this.props.status = InvitationStatus.createExpired();
      // this.addDomainEvent(new InvitationExpiredEvent(this.id.value));
      throw new Error('Invitation has expired and cannot be accepted.');
    }
    this.props.status = InvitationStatus.createAccepted();
    // this.addDomainEvent(new InvitationAcceptedEvent(this.id.value, this.organizationId));
  }

  public decline(): void {
    if (!this.props.status.is(InvitationStatusValues.PENDING)) {
      throw new Error('Invitation cannot be declined as it is not in pending state.');
    }
    this.props.status = InvitationStatus.createDeclined();
    // this.addDomainEvent(new InvitationDeclinedEvent(this.id.value, this.organizationId));
  }

  public expire(): void {
    if (this.props.status.is(InvitationStatusValues.EXPIRED) ||
        this.props.status.is(InvitationStatusValues.ACCEPTED) ||
        this.props.status.is(InvitationStatusValues.DECLINED) ||
        this.props.status.is(InvitationStatusValues.REVOKED)) {
      return;
    }
    this.props.status = InvitationStatus.createExpired();
    // this.addDomainEvent(new InvitationExpiredEvent(this.id.value));
  }

  public revoke(): void {
    if (!this.props.status.is(InvitationStatusValues.PENDING)) {
      throw new Error('Only pending invitations can be revoked.');
    }
    this.props.status = InvitationStatus.createRevoked();
    // this.addDomainEvent(new InvitationRevokedEvent(this.id.value, this.organizationId));
  }

  public resend(newToken: string, newExpiresAt: Date): void {
    if (!this.props.status.is(InvitationStatusValues.PENDING) &&
        !this.props.status.is(InvitationStatusValues.EXPIRED)) {
        throw new Error('Only pending or expired invitations can be resent.');
    }
    Guard.againstNullOrUndefined(newToken, 'newToken');
    Guard.againstEmptyString(newToken, 'newToken');
    Guard.againstNullOrUndefined(newExpiresAt, 'newExpiresAt');

    if (newExpiresAt <= new Date()) {
      throw new Error('New expiry date must be in the future for resend.');
    }
    this.props.token = newToken;
    this.props.expiresAt = newExpiresAt;
    this.props.status = InvitationStatus.createPending();
    // this.addDomainEvent(new InvitationResentEvent(this.id.value, this.organizationId, newToken));
  }
}
