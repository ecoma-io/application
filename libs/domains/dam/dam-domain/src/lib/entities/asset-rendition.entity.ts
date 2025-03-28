import { Entity } from '../interfaces/entity.interface';
import { RenditionType, RenditionTypeEnum } from '../value-objects';

/**
 * Thực thể đại diện cho một phiên bản (rendition) của tài sản gốc.
 * Thuộc về Aggregate Root Asset.
 */
export class AssetRendition implements Entity {
  /**
   * ID duy nhất của rendition.
   */
  private readonly _id: string;

  /**
   * ID của tài sản mà rendition thuộc về.
   */
  private readonly _assetId: string;

  /**
   * Loại phiên bản (Thumbnail, Small, Medium, Large, Custom).
   */
  private readonly _renditionType: RenditionType;

  /**
   * Tên file được lưu trữ nội bộ cho phiên bản này.
   */
  private readonly _storedFileName: string;

  /**
   * Đường dẫn nội bộ đến file phiên bản.
   */
  private readonly _filePath: string;

  /**
   * Loại MIME của phiên bản.
   */
  private readonly _mimeType: string;

  /**
   * Kích thước file phiên bản (byte).
   */
  private readonly _fileSize: number;

  /**
   * Chiều rộng của phiên bản (pixel), tùy chọn.
   */
  private readonly _width?: number;

  /**
   * Chiều cao của phiên bản (pixel), tùy chọn.
   */
  private readonly _height?: number;

  /**
   * Thời điểm tạo phiên bản.
   */
  private readonly _createdAt: Date;

  /**
   * Khởi tạo một AssetRendition.
   *
   * @param id - ID duy nhất
   * @param assetId - ID của tài sản chứa rendition
   * @param renditionType - Loại phiên bản
   * @param storedFileName - Tên file được lưu trữ
   * @param filePath - Đường dẫn file
   * @param mimeType - Loại MIME
   * @param fileSize - Kích thước file (byte)
   * @param width - Chiều rộng (pixel), tùy chọn
   * @param height - Chiều cao (pixel), tùy chọn
   * @param createdAt - Thời điểm tạo
   */
  constructor(
    id: string,
    assetId: string,
    renditionType: RenditionType,
    storedFileName: string,
    filePath: string,
    mimeType: string,
    fileSize: number,
    width?: number,
    height?: number,
    createdAt: Date = new Date()
  ) {
    this._id = id;
    this._assetId = assetId;
    this._renditionType = renditionType;
    this._storedFileName = storedFileName;
    this._filePath = filePath;
    this._mimeType = mimeType;
    this._fileSize = fileSize;
    this._width = width;
    this._height = height;
    this._createdAt = createdAt;
  }

  /**
   * Lấy ID của rendition.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Lấy ID của tài sản chứa rendition.
   */
  get assetId(): string {
    return this._assetId;
  }

  /**
   * Lấy loại phiên bản.
   */
  get renditionType(): RenditionType {
    return this._renditionType;
  }

  /**
   * Lấy tên file được lưu trữ.
   */
  get storedFileName(): string {
    return this._storedFileName;
  }

  /**
   * Lấy đường dẫn file.
   */
  get filePath(): string {
    return this._filePath;
  }

  /**
   * Lấy loại MIME.
   */
  get mimeType(): string {
    return this._mimeType;
  }

  /**
   * Lấy kích thước file.
   */
  get fileSize(): number {
    return this._fileSize;
  }

  /**
   * Lấy chiều rộng.
   */
  get width(): number | undefined {
    return this._width;
  }

  /**
   * Lấy chiều cao.
   */
  get height(): number | undefined {
    return this._height;
  }

  /**
   * Lấy thời điểm tạo.
   */
  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Kiểm tra xem rendition có phải là thumbnail không.
   *
   * @returns true nếu là thumbnail
   */
  isThumbnail(): boolean {
    return this._renditionType.equals(RenditionType.thumbnail());
  }

  /**
   * Kiểm tra xem rendition có kích thước không.
   *
   * @returns true nếu có thông tin kích thước (width và height)
   */
  hasDimensions(): boolean {
    return this._width !== undefined && this._height !== undefined;
  }

  /**
   * Lấy tỷ lệ khung hình (aspect ratio) của rendition.
   *
   * @returns Tỷ lệ khung hình hoặc undefined nếu không có kích thước
   */
  getAspectRatio(): number | undefined {
    if (this.hasDimensions() && this._height && this._height > 0) {
      return (this._width || 0) / this._height;
    }
    return undefined;
  }

  /**
   * Tạo một bản sao của rendition.
   *
   * @returns Bản sao của rendition
   */
  clone(): AssetRendition {
    return new AssetRendition(
      this._id,
      this._assetId,
      this._renditionType,
      this._storedFileName,
      this._filePath,
      this._mimeType,
      this._fileSize,
      this._width,
      this._height,
      new Date(this._createdAt)
    );
  }
}
