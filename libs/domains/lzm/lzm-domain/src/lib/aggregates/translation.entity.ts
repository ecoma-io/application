import { TranslationAddedEvent, TranslationRemovedEvent, TranslationStatusChangedEvent, TranslationUpdatedEvent } from '../domain-events/translation-events';

/**
 * Enum định nghĩa các trạng thái có thể có của bản dịch.
 */
export enum TranslationStatus {
  DRAFT = 'Draft',
  TRANSLATED = 'Translated',
  NEEDS_REVIEW = 'NeedsReview',
  APPROVED = 'Approved',
  OUTDATED = 'Outdated',
}

/**
 * Entity Translation đại diện cho một bản dịch cụ thể của một khóa bản dịch ở một locale nhất định.
 */
export class TranslationEntity {
  private _domainEvents: any[] = [];

  /**
   * Khởi tạo một Translation mới.
   *
   * @param id ID duy nhất của bản dịch
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale/ngôn ngữ
   * @param content Nội dung bản dịch
   * @param status Trạng thái của bản dịch
   * @param translatedBy Thông tin về người/hệ thống tạo/cập nhật bản dịch
   * @param lastUpdatedAt Thời điểm cập nhật cuối cùng
   * @param createdAt Thời điểm tạo
   */
  constructor(
    private _id: string,
    private _keyId: string,
    private _locale: string,
    private _content: string,
    private _status: TranslationStatus = TranslationStatus.DRAFT,
    private _translatedBy?: string,
    private _lastUpdatedAt: Date = new Date(),
    private _createdAt: Date = new Date()
  ) {}

  /**
   * Tạo một Translation mới.
   *
   * @param id ID duy nhất của bản dịch
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale/ngôn ngữ
   * @param content Nội dung bản dịch
   * @param translatedBy Thông tin về người/hệ thống tạo bản dịch
   * @returns Translation mới đã được tạo
   */
  public static create(
    id: string,
    keyId: string,
    locale: string,
    content: string,
    translatedBy?: string
  ): TranslationEntity {
    const now = new Date();
    const translation = new TranslationEntity(
      id,
      keyId,
      locale,
      content,
      TranslationStatus.DRAFT,
      translatedBy,
      now,
      now
    );

    // Thêm domain event
    translation._domainEvents.push(new TranslationAddedEvent(keyId, locale, id, content, TranslationStatus.DRAFT));

    return translation;
  }

  /**
   * Cập nhật nội dung bản dịch.
   *
   * @param content Nội dung bản dịch mới
   * @param translatedBy Thông tin về người/hệ thống cập nhật bản dịch
   */
  public updateContent(content: string, translatedBy?: string): void {
    this._content = content;

    if (translatedBy) {
      this._translatedBy = translatedBy;
    }

    this._lastUpdatedAt = new Date();

    // Nếu bản dịch đang ở trạng thái Outdated, chuyển về Draft
    if (this._status === TranslationStatus.OUTDATED) {
      this.setStatus(TranslationStatus.DRAFT);
    }

    // Thêm domain event
    this._domainEvents.push(new TranslationUpdatedEvent(this._keyId, this._locale, this._id, content, this._status));
  }

  /**
   * Đánh dấu bản dịch đã bị xóa.
   */
  public markAsRemoved(): void {
    // Thêm domain event
    this._domainEvents.push(new TranslationRemovedEvent(this._keyId, this._locale, this._id));
  }

  /**
   * Đánh dấu bản dịch đã lỗi thời do nội dung gốc thay đổi.
   */
  public markAsOutdated(): void {
    if (this._status !== TranslationStatus.OUTDATED) {
      const oldStatus = this._status;
      this._status = TranslationStatus.OUTDATED;
      this._lastUpdatedAt = new Date();

      // Thêm domain event
      this._domainEvents.push(new TranslationStatusChangedEvent(
        this._keyId,
        this._locale,
        this._id,
        oldStatus,
        TranslationStatus.OUTDATED
      ));
    }
  }

  /**
   * Đặt trạng thái cho bản dịch.
   *
   * @param newStatus Trạng thái mới
   * @throws Error nếu chuyển đổi trạng thái không hợp lệ
   */
  public setStatus(newStatus: string): void {
    // Chuyển đổi newStatus thành enum
    let targetStatus: TranslationStatus;
    switch (newStatus) {
      case 'Draft':
        targetStatus = TranslationStatus.DRAFT;
        break;
      case 'Translated':
        targetStatus = TranslationStatus.TRANSLATED;
        break;
      case 'NeedsReview':
        targetStatus = TranslationStatus.NEEDS_REVIEW;
        break;
      case 'Approved':
        targetStatus = TranslationStatus.APPROVED;
        break;
      case 'Outdated':
        targetStatus = TranslationStatus.OUTDATED;
        break;
      default:
        throw new Error(`Trạng thái '${newStatus}' không hợp lệ`);
    }

    // Kiểm tra chuyển đổi trạng thái có hợp lệ không
    this.validateStatusTransition(targetStatus);

    const oldStatus = this._status;
    this._status = targetStatus;
    this._lastUpdatedAt = new Date();

    // Thêm domain event
    this._domainEvents.push(new TranslationStatusChangedEvent(
      this._keyId,
      this._locale,
      this._id,
      oldStatus,
      targetStatus
    ));
  }

  /**
   * Kiểm tra xem chuyển đổi trạng thái có hợp lệ không.
   *
   * @param newStatus Trạng thái mới
   * @throws Error nếu chuyển đổi trạng thái không hợp lệ
   */
  private validateStatusTransition(newStatus: TranslationStatus): void {
    // Vòng đời trạng thái:
    // Draft -> Translated -> NeedsReview -> Approved
    // Outdated -> Draft
    // NeedsReview -> Translated (cần sửa thêm)

    const isValid = (
      // Luôn có thể chuyển sang Outdated (do nội dung gốc thay đổi)
      newStatus === TranslationStatus.OUTDATED ||

      // Chuyển từ Draft sang Translated
      (this._status === TranslationStatus.DRAFT && newStatus === TranslationStatus.TRANSLATED) ||

      // Chuyển từ Translated sang NeedsReview
      (this._status === TranslationStatus.TRANSLATED && newStatus === TranslationStatus.NEEDS_REVIEW) ||

      // Chuyển từ NeedsReview sang Approved
      (this._status === TranslationStatus.NEEDS_REVIEW && newStatus === TranslationStatus.APPROVED) ||

      // Chuyển từ NeedsReview về Translated (cần sửa thêm)
      (this._status === TranslationStatus.NEEDS_REVIEW && newStatus === TranslationStatus.TRANSLATED) ||

      // Chuyển từ Outdated sang Draft
      (this._status === TranslationStatus.OUTDATED && newStatus === TranslationStatus.DRAFT) ||

      // Không thay đổi trạng thái
      this._status === newStatus
    );

    if (!isValid) {
      throw new Error(`Không thể chuyển từ trạng thái '${this._status}' sang '${newStatus}'`);
    }
  }

  /**
   * Lấy tất cả các sự kiện miền đã tích lũy và xóa khỏi entity.
   *
   * @returns Mảng các sự kiện miền
   */
  public clearEvents(): any[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get keyId(): string {
    return this._keyId;
  }

  get locale(): string {
    return this._locale;
  }

  get content(): string {
    return this._content;
  }

  get status(): string {
    return this._status;
  }

  get translatedBy(): string | undefined {
    return this._translatedBy;
  }

  get lastUpdatedAt(): Date {
    return this._lastUpdatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
