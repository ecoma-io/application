import { TranslationEntity } from './translation.entity';
import { TranslationKeyAddedEvent, TranslationKeyUpdatedEvent } from '../domain-events/translation-key-events';

/**
 * Enum định nghĩa các trạng thái có thể có của Khóa Bản dịch.
 */
export enum TranslationKeyStatus {
  NEEDS_TRANSLATION = 'NeedsTranslation',
  TRANSLATED = 'Translated',
  NEEDS_REVIEW = 'NeedsReview',
}

/**
 * Entity TranslationKey đại diện cho một Khóa Bản dịch trong hệ thống.
 * Mỗi khóa bản dịch thuộc về một TranslationSet.
 */
export class TranslationKeyEntity {
  private _translations: TranslationEntity[] = [];
  private _domainEvents: any[] = [];

  /**
   * Khởi tạo một TranslationKey mới.
   *
   * @param id ID duy nhất của khóa bản dịch
   * @param setId ID của tập bản dịch chứa khóa này
   * @param key Chuỗi định danh duy nhất của khóa bản dịch
   * @param description Mô tả ngữ cảnh sử dụng của khóa bản dịch
   * @param sourceContent Nội dung gốc của khóa bản dịch
   * @param status Trạng thái chung của khóa bản dịch
   * @param createdAt Thời điểm tạo
   * @param updatedAt Thời điểm cập nhật cuối cùng
   */
  constructor(
    private _id: string,
    private _setId: string,
    private _key: string,
    private _description: string | undefined,
    private _sourceContent: string,
    private _status: TranslationKeyStatus = TranslationKeyStatus.NEEDS_TRANSLATION,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Tạo một TranslationKey mới.
   *
   * @param id ID duy nhất của khóa bản dịch
   * @param setId ID của tập bản dịch chứa khóa này
   * @param key Chuỗi định danh duy nhất của khóa bản dịch
   * @param sourceContent Nội dung gốc của khóa bản dịch
   * @param description Mô tả ngữ cảnh sử dụng của khóa bản dịch
   * @returns TranslationKey mới đã được tạo
   */
  public static create(
    id: string,
    setId: string,
    key: string,
    sourceContent: string,
    description?: string
  ): TranslationKeyEntity {
    const now = new Date();
    const translationKey = new TranslationKeyEntity(
      id,
      setId,
      key,
      description,
      sourceContent,
      TranslationKeyStatus.NEEDS_TRANSLATION,
      now,
      now
    );

    // Thêm domain event
    translationKey._domainEvents.push(new TranslationKeyAddedEvent(id, key, setId, sourceContent));

    return translationKey;
  }

  /**
   * Cập nhật thông tin TranslationKey.
   *
   * @param sourceContent Nội dung gốc mới
   * @param description Mô tả mới
   */
  public update(sourceContent: string, description?: string): void {
    const sourceContentChanged = this._sourceContent !== sourceContent;

    this._sourceContent = sourceContent;
    this._description = description;
    this._updatedAt = new Date();

    // Nếu nội dung gốc thay đổi, cập nhật trạng thái các bản dịch
    if (sourceContentChanged) {
      this._translations.forEach(translation => {
        if (translation.status !== 'Draft') {
          translation.markAsOutdated();
        }
      });
    }

    // Thêm domain event
    this._domainEvents.push(new TranslationKeyUpdatedEvent(this._id, this._key, sourceContent));
  }

  /**
   * Thêm một bản dịch mới cho khóa này.
   *
   * @param translation Bản dịch cần thêm
   * @throws Error nếu bản dịch cho locale này đã tồn tại
   */
  public addTranslation(translation: TranslationEntity): void {
    if (this.hasTranslationForLocale(translation.locale)) {
      throw new Error(`Đã tồn tại bản dịch cho locale '${translation.locale}' của khóa '${this._key}'`);
    }

    this._translations.push(translation);
    this._updatedAt = new Date();
    this.updateStatus();
  }

  /**
   * Cập nhật bản dịch hiện có.
   *
   * @param translationId ID của bản dịch cần cập nhật
   * @param content Nội dung bản dịch mới
   * @throws Error nếu không tìm thấy bản dịch
   */
  public updateTranslation(translationId: string, content: string): void {
    const translation = this._translations.find(t => t.id === translationId);
    if (!translation) {
      throw new Error(`Không tìm thấy bản dịch với ID '${translationId}'`);
    }

    translation.updateContent(content);
    this._updatedAt = new Date();
    this.updateStatus();
  }

  /**
   * Đặt trạng thái cho một bản dịch.
   *
   * @param translationId ID của bản dịch cần cập nhật trạng thái
   * @param newStatus Trạng thái mới
   * @throws Error nếu không tìm thấy bản dịch hoặc chuyển đổi trạng thái không hợp lệ
   */
  public setTranslationStatus(translationId: string, newStatus: string): void {
    const translation = this._translations.find(t => t.id === translationId);
    if (!translation) {
      throw new Error(`Không tìm thấy bản dịch với ID '${translationId}'`);
    }

    translation.setStatus(newStatus);
    this._updatedAt = new Date();
    this.updateStatus();
  }

  /**
   * Xóa một bản dịch.
   *
   * @param translationId ID của bản dịch cần xóa
   * @returns true nếu xóa thành công, false nếu không tìm thấy
   */
  public removeTranslation(translationId: string): boolean {
    const initialLength = this._translations.length;
    this._translations = this._translations.filter(t => t.id !== translationId);

    if (this._translations.length !== initialLength) {
      this._updatedAt = new Date();
      this.updateStatus();
      return true;
    }

    return false;
  }

  /**
   * Lấy bản dịch cho một locale cụ thể.
   *
   * @param locale Locale cần lấy bản dịch
   * @returns Bản dịch nếu tìm thấy, undefined nếu không
   */
  public getTranslationForLocale(locale: string): TranslationEntity | undefined {
    return this._translations.find(t => t.locale === locale);
  }

  /**
   * Kiểm tra xem đã có bản dịch cho locale cụ thể chưa.
   *
   * @param locale Locale cần kiểm tra
   * @returns true nếu đã có bản dịch, false nếu chưa
   */
  public hasTranslationForLocale(locale: string): boolean {
    return this._translations.some(t => t.locale === locale);
  }

  /**
   * Cập nhật trạng thái tổng thể của khóa bản dịch dựa trên trạng thái của các bản dịch.
   */
  private updateStatus(): void {
    if (this._translations.length === 0) {
      this._status = TranslationKeyStatus.NEEDS_TRANSLATION;
      return;
    }

    if (this._translations.every(t => t.status === 'Approved')) {
      this._status = TranslationKeyStatus.TRANSLATED;
    } else if (this._translations.some(t => t.status === 'NeedsReview')) {
      this._status = TranslationKeyStatus.NEEDS_REVIEW;
    } else {
      this._status = TranslationKeyStatus.NEEDS_TRANSLATION;
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

  get setId(): string {
    return this._setId;
  }

  get key(): string {
    return this._key;
  }

  get description(): string | undefined {
    return this._description;
  }

  get sourceContent(): string {
    return this._sourceContent;
  }

  get status(): string {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get translations(): TranslationEntity[] {
    return [...this._translations];
  }
}
