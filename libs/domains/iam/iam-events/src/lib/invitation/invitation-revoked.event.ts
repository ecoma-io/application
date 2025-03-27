export interface IInvitationRevokedEvent {
  readonly eventType: "InvitationRevoked";
  readonly invitationId: string;
  readonly tenantId: string;
  readonly inviteeEmail: string;
  readonly issuedAt: Date;
}
