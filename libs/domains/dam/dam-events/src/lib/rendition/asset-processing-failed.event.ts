export interface IAssetProcessingFailedEvent {
  readonly eventType: "AssetProcessingFailed";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly processingStep: string;
  readonly failureReason: string;
  readonly issuedAt: Date;
}
