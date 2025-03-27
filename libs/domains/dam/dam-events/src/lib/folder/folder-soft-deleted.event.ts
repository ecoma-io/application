export interface IFolderSoftDeletedEvent {
  readonly eventType: "FolderSoftDeleted";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly deletedByUserId: string;
  readonly issuedAt: Date;
}
