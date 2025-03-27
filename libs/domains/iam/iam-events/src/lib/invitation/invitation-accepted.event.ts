export interface IInvitationAcceptedEvent {
  readonly eventType: "InvitationAccepted";
  readonly invitationId: string;
  readonly tenantId: string;
  readonly inviteeEmail: string;
  readonly acceptedUserId: string;
  readonly issuedAt: Date;
}
