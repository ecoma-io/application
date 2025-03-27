export interface IAssetRestoredEvent {
  readonly eventType: "AssetRestored";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly restoredByUserId: string;
  readonly issuedAt: Date;
}
