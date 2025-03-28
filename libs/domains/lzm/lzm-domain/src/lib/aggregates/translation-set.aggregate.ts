import { TranslationKeyEntity } from './translation-key.entity';
import { InvalidTranslationSetException } from '../exceptions/translation-set.exceptions';
import { TranslationSetCreatedEvent, TranslationSetDeletedEvent, TranslationSetUpdatedEvent } from '../domain-events/translation-set-events';

/**
 * TranslationSet là Aggregate Root đại diện cho một tập hợp các Khóa Bản dịch có liên quan.
 */
export class TranslationSet {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _translationKeys: TranslationKeyEntity[];
  private _domainEvents: any[] = [];

  /**
   * Khởi tạo một TranslationSet mới.
   *
   * @param id ID duy nhất của tập bản dịch
   * @param name Tên định danh duy nhất của tập bản dịch
   * @param description Mô tả về tập bản dịch
   * @param isActive Trạng thái hoạt động của tập bản dịch
   * @param createdAt Thời điểm tạo
   * @param updatedAt Thời điểm cập nhật cuối cùng
   * @param translationKeys Danh sách các Khóa Bản dịch thuộc tập này
   */
  private constructor(
    id: string,
    name: string,
    description: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    translationKeys: TranslationKeyEntity[] = []
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._translationKeys = translationKeys;
  }

  /**
   * Tạo một TranslationSet mới.
   *
   * @param id ID duy nhất của tập bản dịch
   * @param name Tên định danh duy nhất của tập bản dịch
   * @param description Mô tả về tập bản dịch
   * @returns TranslationSet mới đã được tạo
   */
  public static create(
    id: string,
    name: string,
    description?: string
  ): TranslationSet {
    this.validateName(name);

    const now = new Date();
    const translationSet = new TranslationSet(
      id,
      name,
      description,
      true, // isActive = true by default
      now,
      now,
      []
    );

    // Thêm domain event
    translationSet._domainEvents.push(new TranslationSetCreatedEvent(id, name));

    return translationSet;
  }

  /**
   * Cập nhật thông tin TranslationSet.
   *
   * @param name Tên mới của tập bản dịch
   * @param description Mô tả mới của tập bản dịch
   */
  public update(name: string, description?: string): void {
    if (this._name !== name) {
      TranslationSet.validateName(name);
      this._name = name;
    }

    this._description = description;
    this._updatedAt = new Date();

    // Thêm domain event
    this._domainEvents.push(new TranslationSetUpdatedEvent(this._id, this._name));
  }

  /**
   * Kích hoạt tập bản dịch.
   */
  public activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this._updatedAt = new Date();

      // Thêm domain event
      this._domainEvents.push(new TranslationSetUpdatedEvent(this._id, this._name));
    }
  }

  /**
   * Vô hiệu hóa tập bản dịch.
   */
  public deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this._updatedAt = new Date();

      // Thêm domain event
      this._domainEvents.push(new TranslationSetUpdatedEvent(this._id, this._name));
    }
  }

  /**
   * Đánh dấu tập bản dịch đã bị xóa.
   */
  public markAsDeleted(): void {
    // Thêm domain event
    this._domainEvents.push(new TranslationSetDeletedEvent(this._id, this._name));
  }

  /**
   * Thêm một Khóa Bản dịch vào tập.
   *
   * @param translationKey Khóa Bản dịch cần thêm
   * @throws InvalidTranslationSetException nếu khóa đã tồn tại trong tập
   */
  public addKey(translationKey: TranslationKeyEntity): void {
    if (this.hasKey(translationKey.key)) {
      throw new InvalidTranslationSetException(`Khóa '${translationKey.key}' đã tồn tại trong tập '${this._name}'`);
    }

    this._translationKeys.push(translationKey);
    this._updatedAt = new Date();

    // Thêm domain event
    this._domainEvents.push(new TranslationSetUpdatedEvent(this._id, this._name));
  }

  /**
   * Xóa một Khóa Bản dịch khỏi tập theo ID.
   *
   * @param keyId ID của Khóa Bản dịch cần xóa
   * @returns true nếu xóa thành công, false nếu không tìm thấy
   */
  public removeKeyById(keyId: string): boolean {
    const initialLength = this._translationKeys.length;
    this._translationKeys = this._translationKeys.filter(key => key.id !== keyId);

    if (this._translationKeys.length !== initialLength) {
      this._updatedAt = new Date();

      // Thêm domain event
      this._domainEvents.push(new TranslationSetUpdatedEvent(this._id, this._name));
      return true;
    }

    return false;
  }

  /**
   * Lấy một Khóa Bản dịch theo ID.
   *
   * @param keyId ID của Khóa Bản dịch cần lấy
   * @returns Khóa Bản dịch nếu tìm thấy, undefined nếu không
   */
  public getKeyById(keyId: string): TranslationKeyEntity | undefined {
    return this._translationKeys.find(key => key.id === keyId);
  }

  /**
   * Lấy một Khóa Bản dịch theo tên khóa.
   *
   * @param keyName Tên khóa cần lấy
   * @returns Khóa Bản dịch nếu tìm thấy, undefined nếu không
   */
  public getKeyByName(keyName: string): TranslationKeyEntity | undefined {
    return this._translationKeys.find(key => key.key === keyName);
  }

  /**
   * Kiểm tra xem tập có chứa khóa bản dịch với tên nhất định không.
   *
   * @param keyName Tên khóa cần kiểm tra
   * @returns true nếu khóa tồn tại trong tập, false nếu không
   */
  public hasKey(keyName: string): boolean {
    return this._translationKeys.some(key => key.key === keyName);
  }

  /**
   * Lấy tất cả các sự kiện miền đã tích lũy và xóa khỏi aggregate.
   *
   * @returns Mảng các sự kiện miền
   */
  public clearEvents(): any[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  /**
   * Kiểm tra tính hợp lệ của tên tập bản dịch.
   *
   * @param name Tên cần kiểm tra
   * @throws InvalidTranslationSetException nếu tên không hợp lệ
   */
  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidTranslationSetException('Tên tập bản dịch không được để trống');
    }

    if (name.length > 255) {
      throw new InvalidTranslationSetException('Tên tập bản dịch không được vượt quá 255 ký tự');
    }

    // Tên chỉ được chứa chữ cái, số, gạch dưới, dấu chấm và gạch ngang
    const nameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!nameRegex.test(name)) {
      throw new InvalidTranslationSetException('Tên tập bản dịch chỉ được chứa chữ cái, số, gạch dưới, dấu chấm và gạch ngang');
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get translationKeys(): TranslationKeyEntity[] {
    return [...this._translationKeys];
  }
}
