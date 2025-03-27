export interface IAssetHardDeletedEvent {
  readonly eventType: "AssetHardDeleted";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly issuedAt: Date;
}
