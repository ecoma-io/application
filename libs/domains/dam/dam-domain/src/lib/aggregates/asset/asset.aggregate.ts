import { AbstractAggregateRoot } from '../abstract-aggregate-root';
import { AssetStatus } from '../../value-objects/asset-status.value-object';
import { AssetMetadata } from '../../entities/asset-metadata.entity';
import { AssetRendition } from '../../entities/asset-rendition.entity';
import { AssetHistory } from '../../entities/asset-history.entity';
import { RenditionType } from '../../value-objects/rendition-type.value-object';

/**
 * Aggregate Root đại diện cho một tài sản kỹ thuật số trong hệ thống.
 */
export class Asset extends AbstractAggregateRoot {
  /**
   * ID duy nhất của tài sản.
   */
  private readonly _id: string;

  /**
   * ID của tổ chức sở hữu tài sản. Null cho tài sản nội bộ.
   */
  private readonly _tenantId: string | null;

  /**
   * Tên file gốc khi tải lên.
   */
  private readonly _originalFileName: string;

  /**
   * Tên file được lưu trữ nội bộ cho phiên bản file gốc hiện tại.
   */
  private _storedFileName: string;

  /**
   * Đường dẫn nội bộ đến file gốc hiện tại.
   */
  private _filePath: string;

  /**
   * Loại MIME của file gốc.
   */
  private _mimeType: string;

  /**
   * Kích thước file gốc (byte).
   */
  private _fileSize: number;

  /**
   * ID của người dùng đã tải lên phiên bản gốc đầu tiên.
   */
  private readonly _uploadedByUserId: string;

  /**
   * Thời điểm tải lên phiên bản gốc đầu tiên.
   */
  private readonly _uploadedAt: Date;

  /**
   * Danh sách các AssetMetadata Entities.
   */
  private _metadata: AssetMetadata[] = [];

  /**
   * Danh sách các AssetRendition Entities.
   */
  private _renditions: AssetRendition[] = [];

  /**
   * Trạng thái tài sản.
   */
  private _status: AssetStatus;

  /**
   * Số phiên bản hiện tại của file gốc.
   */
  private _currentVersion: number;

  /**
   * Danh sách các AssetHistory Entities.
   */
  private _history: AssetHistory[] = [];

  /**
   * ID của thư mục chứa tài sản. Null nếu không thuộc thư mục nào.
   */
  private _folderId: string | null;

  /**
   * Thời điểm tạo bản ghi Asset.
   */
  private readonly _createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  private _updatedAt: Date;

  /**
   * Khởi tạo một Asset.
   *
   * @param id - ID duy nhất
   * @param tenantId - ID của tổ chức (null cho tài sản nội bộ)
   * @param originalFileName - Tên file gốc khi tải lên
   * @param storedFileName - Tên file được lưu trữ nội bộ
   * @param filePath - Đường dẫn nội bộ đến file
   * @param mimeType - Loại MIME của file
   * @param fileSize - Kích thước file (byte)
   * @param uploadedByUserId - ID người dùng đã tải lên
   * @param status - Trạng thái tài sản
   * @param currentVersion - Số phiên bản hiện tại
   * @param folderId - ID của thư mục chứa tài sản (tùy chọn)
   * @param uploadedAt - Thời điểm tải lên
   * @param createdAt - Thời điểm tạo bản ghi
   * @param updatedAt - Thời điểm cập nhật cuối cùng
   */
  constructor(
    id: string,
    tenantId: string | null,
    originalFileName: string,
    storedFileName: string,
    filePath: string,
    mimeType: string,
    fileSize: number,
    uploadedByUserId: string,
    status: AssetStatus = AssetStatus.uploading(),
    currentVersion = 1,
    folderId: string | null = null,
    uploadedAt: Date = new Date(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super();
    this._id = id;
    this._tenantId = tenantId;
    this._originalFileName = originalFileName;
    this._storedFileName = storedFileName;
    this._filePath = filePath;
    this._mimeType = mimeType;
    this._fileSize = fileSize;
    this._uploadedByUserId = uploadedByUserId;
    this._status = status;
    this._currentVersion = currentVersion;
    this._folderId = folderId;
    this._uploadedAt = uploadedAt;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Lấy ID của tài sản.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Lấy ID của tổ chức.
   */
  get tenantId(): string | null {
    return this._tenantId;
  }

  /**
   * Lấy tên file gốc.
   */
  get originalFileName(): string {
    return this._originalFileName;
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
   * Lấy ID người dùng đã tải lên.
   */
  get uploadedByUserId(): string {
    return this._uploadedByUserId;
  }

  /**
   * Lấy thời điểm tải lên.
   */
  get uploadedAt(): Date {
    return new Date(this._uploadedAt);
  }

  /**
   * Lấy danh sách metadata.
   */
  get metadata(): AssetMetadata[] {
    return [...this._metadata];
  }

  /**
   * Lấy danh sách renditions.
   */
  get renditions(): AssetRendition[] {
    return [...this._renditions];
  }

  /**
   * Lấy trạng thái tài sản.
   */
  get status(): AssetStatus {
    return this._status;
  }

  /**
   * Lấy số phiên bản hiện tại.
   */
  get currentVersion(): number {
    return this._currentVersion;
  }

  /**
   * Lấy danh sách lịch sử.
   */
  get history(): AssetHistory[] {
    return [...this._history];
  }

  /**
   * Lấy ID của thư mục.
   */
  get folderId(): string | null {
    return this._folderId;
  }

  /**
   * Lấy thời điểm tạo.
   */
  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Lấy thời điểm cập nhật cuối cùng.
   */
  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  /**
   * Thiết lập metadata cho tài sản. Thay thế tất cả metadata hiện có.
   *
   * @param metadata - Danh sách metadata mới
   */
  setMetadata(metadata: AssetMetadata[]): void {
    this._metadata = [...metadata];
    this._updateTimestamp();
    // TODO: Phát domain event AssetMetadataUpdated
  }

  /**
   * Thêm một metadata vào tài sản.
   *
   * @param metadata - Metadata cần thêm
   */
  addMetadata(metadata: AssetMetadata): void {
    // Kiểm tra xem metadata với cùng key và locale đã tồn tại chưa
    const existingIndex = this._metadata.findIndex(
      m => m.key === metadata.key && m.locale === metadata.locale
    );

    if (existingIndex >= 0) {
      // Nếu đã tồn tại, cập nhật giá trị
      this._metadata[existingIndex].updateValue(metadata.value);
    } else {
      // Nếu chưa tồn tại, thêm mới
      this._metadata.push(metadata);
    }

    this._updateTimestamp();
    // TODO: Phát domain event AssetMetadataUpdated
  }

  /**
   * Xóa một metadata khỏi tài sản.
   *
   * @param key - Khóa metadata cần xóa
   * @param locale - Locale của metadata cần xóa (tùy chọn)
   */
  removeMetadata(key: string, locale?: string): void {
    const initialLength = this._metadata.length;

    if (locale) {
      // Xóa metadata với key và locale cụ thể
      this._metadata = this._metadata.filter(
        m => !(m.key === key && m.locale === locale)
      );
    } else {
      // Xóa tất cả metadata với key đã cho
      this._metadata = this._metadata.filter(m => m.key !== key);
    }

    if (this._metadata.length !== initialLength) {
      this._updateTimestamp();
      // TODO: Phát domain event AssetMetadataUpdated
    }
  }

  /**
   * Thêm một rendition vào tài sản.
   *
   * @param rendition - Rendition cần thêm
   */
  addRendition(rendition: AssetRendition): void {
    // Kiểm tra xem rendition với cùng loại đã tồn tại chưa
    const existingIndex = this._renditions.findIndex(
      r => r.renditionType.equals(rendition.renditionType)
    );

    if (existingIndex >= 0) {
      // Nếu đã tồn tại, thay thế
      this._renditions[existingIndex] = rendition;
    } else {
      // Nếu chưa tồn tại, thêm mới
      this._renditions.push(rendition);
    }

    this._updateTimestamp();
    // TODO: Phát domain event AssetRenditionCreated
  }

  /**
   * Xóa một rendition khỏi tài sản.
   *
   * @param renditionType - Loại rendition cần xóa
   */
  removeRendition(renditionType: RenditionType): void {
    const initialLength = this._renditions.length;

    this._renditions = this._renditions.filter(
      r => !r.renditionType.equals(renditionType)
    );

    if (this._renditions.length !== initialLength) {
      this._updateTimestamp();
      // TODO: Phát domain event AssetRenditionDeleted
    }
  }

  /**
   * Tìm một rendition theo loại.
   *
   * @param renditionType - Loại rendition cần tìm
   * @returns Rendition nếu tìm thấy, undefined nếu không tìm thấy
   */
  findRendition(renditionType: RenditionType): AssetRendition | undefined {
    return this._renditions.find(r => r.renditionType.equals(renditionType));
  }

  /**
   * Thiết lập renditions cho tài sản. Thay thế tất cả renditions hiện có.
   *
   * @param renditions - Danh sách renditions mới
   */
  setRenditions(renditions: AssetRendition[]): void {
    this._renditions = [...renditions];
    this._updateTimestamp();
    // TODO: Phát domain event AssetRenditionsUpdated
  }

  /**
   * Cập nhật file gốc của tài sản.
   *
   * @param storedFileName - Tên file mới được lưu trữ
   * @param filePath - Đường dẫn file mới
   * @param mimeType - Loại MIME mới
   * @param fileSize - Kích thước file mới
   * @param uploadedByUserId - ID người dùng cập nhật
   * @param history - AssetHistory cho phiên bản cũ
   */
  updateFile(
    storedFileName: string,
    filePath: string,
    mimeType: string,
    fileSize: number,
    uploadedByUserId: string,
    history: AssetHistory
  ): void {
    // Thêm lịch sử cho phiên bản cũ
    this._history.push(history);

    // Cập nhật thông tin file
    this._storedFileName = storedFileName;
    this._filePath = filePath;
    this._mimeType = mimeType;
    this._fileSize = fileSize;

    // Tăng số phiên bản
    this._currentVersion++;

    // Cập nhật trạng thái và thời gian
    this._status = AssetStatus.active();
    this._updateTimestamp();

    // TODO: Phát domain event AssetUpdated
  }

  /**
   * Thiết lập lịch sử phiên bản cho tài sản. Thay thế tất cả lịch sử hiện có.
   *
   * @param history - Danh sách lịch sử mới
   */
  setHistory(history: AssetHistory[]): void {
    this._history = [...history];
  }

  /**
   * Kích hoạt tài sản (đặt trạng thái thành ACTIVE).
   */
  activate(): void {
    if (!this._status.equals(AssetStatus.active())) {
      const oldStatus = this._status;
      this._status = AssetStatus.active();
      this._updateTimestamp();

      // TODO: Phát domain event AssetStatusChanged
    }
  }

  /**
   * Vô hiệu hóa tài sản (đặt trạng thái thành INACTIVE).
   */
  deactivate(): void {
    if (!this._status.equals(AssetStatus.inactive())) {
      const oldStatus = this._status;
      this._status = AssetStatus.inactive();
      this._updateTimestamp();

      // TODO: Phát domain event AssetStatusChanged
    }
  }

  /**
   * Xóa mềm tài sản (đặt trạng thái thành SOFT_DELETED).
   */
  softDelete(): void {
    if (!this._status.equals(AssetStatus.softDeleted())) {
      const oldStatus = this._status;
      this._status = AssetStatus.softDeleted();
      this._updateTimestamp();

      // TODO: Phát domain event AssetStatusChanged
    }
  }

  /**
   * Khôi phục tài sản đã xóa mềm (đặt trạng thái thành ACTIVE).
   *
   * @throws Error nếu tài sản không ở trạng thái SOFT_DELETED
   */
  restore(): void {
    if (!this._status.equals(AssetStatus.softDeleted())) {
      throw new Error('Chỉ có thể khôi phục tài sản đã xóa mềm.');
    }

    const oldStatus = this._status;
    this._status = AssetStatus.active();
    this._updateTimestamp();

    // TODO: Phát domain event AssetRestored
  }

  /**
   * Di chuyển tài sản đến một thư mục khác.
   *
   * @param folderId - ID của thư mục đích (null để đưa ra khỏi thư mục)
   */
  moveToFolder(folderId: string | null): void {
    if (this._folderId !== folderId) {
      const oldFolderId = this._folderId;
      this._folderId = folderId;
      this._updateTimestamp();

      // TODO: Phát domain event AssetMoved
    }
  }

  /**
   * Kiểm tra xem tài sản có phải là tài sản nội bộ không.
   *
   * @returns true nếu là tài sản nội bộ (tenantId là null)
   */
  isInternal(): boolean {
    return this._tenantId === null;
  }

  /**
   * Cập nhật thời điểm cập nhật cuối cùng.
   *
   * @private
   */
  private _updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}
