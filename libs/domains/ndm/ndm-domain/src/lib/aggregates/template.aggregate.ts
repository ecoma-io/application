import { AbstractAggregate } from '@ecoma/common-domain';
import { Channel, Locale, StringId } from '../value-objects';

/**
 * Aggregate root đại diện cho một template thông báo
 */
export class Template extends AbstractAggregate<StringId> {
  private nameValue: string;
  private descriptionValue: string;
  private channelValue: Channel;
  private subjectValue: string;
  private contentValue: string;
  private localeValue: Locale;
  private organizationIdValue: string;
  private requiredContextKeysValue: string[];
  private isActiveValue: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    channel: Channel,
    subject: string,
    content: string,
    locale: Locale,
    organizationId: string,
    requiredContextKeys: string[],
    isActive = true,
  ) {
    super(StringId.create(id));
    this.nameValue = name;
    this.descriptionValue = description;
    this.channelValue = channel;
    this.subjectValue = subject;
    this.contentValue = content;
    this.localeValue = locale;
    this.organizationIdValue = organizationId;
    this.requiredContextKeysValue = [...requiredContextKeys];
    this.isActiveValue = isActive;
  }

  // Getters
  get name(): string {
    return this.nameValue;
  }

  get description(): string {
    return this.descriptionValue;
  }

  get channel(): Channel {
    return this.channelValue;
  }

  get subject(): string {
    return this.subjectValue;
  }

  get content(): string {
    return this.contentValue;
  }

  get locale(): Locale {
    return this.localeValue;
  }

  get organizationId(): string {
    return this.organizationIdValue;
  }

  get requiredContextKeys(): readonly string[] {
    return [...this.requiredContextKeysValue];
  }

  get isActive(): boolean {
    return this.isActiveValue;
  }

  /**
   * Kiểm tra xem template có bị vô hiệu hóa không
   */
  public isInactive(): boolean {
    return !this.isActiveValue;
  }

  /**
   * Kích hoạt template
   */
  public activate(): void {
    this.isActiveValue = true;
  }

  /**
   * Vô hiệu hóa template
   */
  public deactivate(): void {
    this.isActiveValue = false;
  }

  /**
   * Kiểm tra xem context có đủ các key yêu cầu không
   * @param contextKeys Danh sách key có trong context
   * @returns true nếu context có đủ các key yêu cầu
   */
  public validateContextKeys(contextKeys: string[]): boolean {
    return this.requiredContextKeysValue.every(requiredKey =>
      contextKeys.includes(requiredKey)
    );
  }

  /**
   * Lấy danh sách các key context bị thiếu
   * @param contextKeys Danh sách key có trong context
   * @returns Danh sách các key bị thiếu
   */
  public getMissingContextKeys(contextKeys: string[]): string[] {
    return this.requiredContextKeysValue.filter(
      requiredKey => !contextKeys.includes(requiredKey)
    );
  }

  /**
   * Cập nhật thông tin template
   * @param name Tên template
   * @param description Mô tả template
   * @param subject Tiêu đề
   * @param content Nội dung
   * @param locale Locale
   * @param requiredContextKeys Danh sách key context bắt buộc
   */
  public update(
    name: string,
    description: string,
    subject: string,
    content: string,
    locale: Locale,
    requiredContextKeys: string[],
  ): void {
    this.nameValue = name;
    this.descriptionValue = description;
    this.subjectValue = subject;
    this.contentValue = content;
    this.localeValue = locale;
    this.requiredContextKeysValue = [...requiredContextKeys];
  }

  /**
   * Kiểm tra template có thể sử dụng không
   */
  public canBeUsed(): boolean {
    return this.isActiveValue;
  }
}
