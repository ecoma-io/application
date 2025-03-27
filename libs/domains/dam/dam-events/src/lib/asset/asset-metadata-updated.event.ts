export interface IAssetMetadataUpdatedEvent {
  readonly eventType: "AssetMetadataUpdated";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly updatedByUserId: string;
  readonly updatedMetadataKeys: string[];
  readonly issuedAt: Date;
}
