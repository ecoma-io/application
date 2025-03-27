export interface IInvitationCreatedEvent {
  readonly eventType: "InvitationCreated";
  readonly invitationId: string;
  readonly tenantId: string;
  readonly inviteeEmail: string;
  readonly inviterUserId: string;
  readonly roleId: string;
  readonly issuedAt: Date;
}
