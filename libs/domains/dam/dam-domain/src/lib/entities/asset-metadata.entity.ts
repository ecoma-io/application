import { Entity } from '../interfaces/entity.interface';

/**
 * Thực thể đại diện cho một cặp key-value metadata của tài sản.
 * Thuộc về Aggregate Root Asset.
 */
export class AssetMetadata implements Entity {
  /**
   * ID duy nhất của metadata.
   */
  private readonly _id: string;

  /**
   * ID của tài sản mà metadata thuộc về.
   */
  private readonly _assetId: string;

  /**
   * Khóa metadata (ví dụ: "title", "description", "tags", "alt_text").
   */
  private readonly _key: string;

  /**
   * Giá trị metadata.
   */
  private _value: string;

  /**
   * Mã locale nếu là metadata đa ngôn ngữ (liên kết với RDM/LZM). Null cho metadata chung.
   */
  private readonly _locale: string | null;

  /**
   * Thời điểm tạo metadata.
   */
  private readonly _createdAt: Date;

  /**
   * Thời điểm cập nhật metadata cuối cùng.
   */
  private _updatedAt: Date;

  /**
   * Khởi tạo một AssetMetadata.
   *
   * @param id - ID duy nhất
   * @param assetId - ID của tài sản chứa metadata
   * @param key - Khóa metadata
   * @param value - Giá trị metadata
   * @param locale - Mã locale (tùy chọn)
   * @param createdAt - Thời điểm tạo
   * @param updatedAt - Thời điểm cập nhật cuối cùng
   */
  constructor(
    id: string,
    assetId: string,
    key: string,
    value: string,
    locale: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._assetId = assetId;
    this._key = key;
    this._value = value;
    this._locale = locale;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Lấy ID của metadata.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Lấy ID của tài sản chứa metadata.
   */
  get assetId(): string {
    return this._assetId;
  }

  /**
   * Lấy khóa metadata.
   */
  get key(): string {
    return this._key;
  }

  /**
   * Lấy giá trị metadata.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Lấy mã locale của metadata.
   */
  get locale(): string | null {
    return this._locale;
  }

  /**
   * Lấy thời điểm tạo metadata.
   */
  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Lấy thời điểm cập nhật metadata cuối cùng.
   */
  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  /**
   * Cập nhật giá trị của metadata.
   *
   * @param value - Giá trị mới
   */
  updateValue(value: string): void {
    this._value = value;
    this._updatedAt = new Date();
  }

  /**
   * Kiểm tra xem metadata có được quốc tế hóa không (có locale).
   *
   * @returns true nếu metadata có locale
   */
  isLocalized(): boolean {
    return this._locale !== null;
  }

  /**
   * Tạo một bản sao của metadata.
   *
   * @returns Bản sao của metadata
   */
  clone(): AssetMetadata {
    return new AssetMetadata(
      this._id,
      this._assetId,
      this._key,
      this._value,
      this._locale,
      new Date(this._createdAt),
      new Date(this._updatedAt)
    );
  }
}
