export interface IAssetUploadedEvent {
  readonly eventType: "AssetUploaded";
  readonly assetId: string;
  readonly tenantId?: string;
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly fileSize: number;
  readonly uploadedByUserId: string;
  readonly folderId?: string;
  readonly issuedAt: Date;
}
