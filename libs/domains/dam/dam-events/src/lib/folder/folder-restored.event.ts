export interface IFolderRestoredEvent {
  readonly eventType: "FolderRestored";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly restoredByUserId: string;
  readonly issuedAt: Date;
}
