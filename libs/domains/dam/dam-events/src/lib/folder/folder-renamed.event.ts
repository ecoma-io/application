export interface IFolderRenamedEvent {
  readonly eventType: "FolderRenamed";
  readonly folderId: string;
  readonly tenantId?: string;
  readonly oldName: string;
  readonly newName: string;
  readonly renamedByUserId: string;
  readonly issuedAt: Date;
}
