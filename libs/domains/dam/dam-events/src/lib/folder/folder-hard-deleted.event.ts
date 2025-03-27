export interface IFolderHardDeletedEvent {
  readonly eventType: "FolderHardDeleted";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly issuedAt: Date;
}
