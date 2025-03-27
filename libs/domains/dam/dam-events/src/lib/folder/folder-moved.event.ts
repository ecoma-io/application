export interface IFolderMovedEvent {
  readonly eventType: "FolderMoved";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly oldParentFolderId?: string;
  readonly newParentFolderId?: string;
  readonly movedByUserId: string;
  readonly issuedAt: Date;
}
