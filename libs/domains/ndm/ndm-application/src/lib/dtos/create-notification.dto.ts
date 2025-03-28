/**
 * DTO cho việc tạo thông báo mới
 */
export class CreateNotificationDto {
  constructor(
    public readonly templateId: string,
    public readonly recipientId: string,
    public readonly organizationId: string,
    public readonly context: Record<string, unknown>,
  ) {}
}
