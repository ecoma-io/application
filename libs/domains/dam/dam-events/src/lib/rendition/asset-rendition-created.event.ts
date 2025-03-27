export interface IAssetRenditionCreatedEvent {
  readonly eventType: "AssetRenditionCreated";
  readonly assetId: string;
  readonly renditionId: string;
  readonly tenantId?: string;
  readonly renditionType: string;
  readonly filePath: string;
  readonly mimeType: string;
  readonly fileSize: number;
  readonly issuedAt: Date;
}
