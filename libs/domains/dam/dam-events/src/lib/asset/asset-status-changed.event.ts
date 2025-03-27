export interface IAssetStatusChangedEvent {
  readonly eventType: "AssetStatusChanged";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly oldStatus: string;
  readonly newStatus: string;
  readonly changedByUserId?: string;
  readonly issuedAt: Date;
}
