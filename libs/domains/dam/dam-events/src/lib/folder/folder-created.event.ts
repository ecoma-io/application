export interface IFolderCreatedEvent {
  readonly eventType: "FolderCreated";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly name: string;
  readonly parentFolderId?: string;
  readonly createdByUserId: string;
  readonly issuedAt: Date;
}
