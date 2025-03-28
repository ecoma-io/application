/**
 * DTO cho việc cập nhật template
 */
export class UpdateTemplateDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly locale: string,
    public readonly requiredContextKeys: string[],
  ) {}
}
