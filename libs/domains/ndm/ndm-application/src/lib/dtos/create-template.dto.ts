/**
 * DTO cho việc tạo template mới
 */
export class CreateTemplateDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly channel: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly locale: string,
    public readonly organizationId: string,
    public readonly requiredContextKeys: string[],
  ) {}
}
