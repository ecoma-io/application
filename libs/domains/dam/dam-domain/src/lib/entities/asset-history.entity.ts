import { Entity } from '../interfaces/entity.interface';

/**
 * Thực thể đại diện cho một phiên bản lịch sử của file tài sản gốc.
 * Thuộc về Aggregate Root Asset.
 */
export class AssetHistory implements Entity {
  /**
   * ID duy nhất của phiên bản lịch sử.
   */
  private readonly _id: string;

  /**
   * ID của tài sản mà phiên bản lịch sử thuộc về.
   */
  private readonly _assetId: string;

  /**
   * Số phiên bản. Tăng dần và duy nhất trong phạm vi Asset.
   */
  private readonly _version: number;

  /**
   * Tên file được lưu trữ nội bộ cho phiên bản lịch sử.
   */
  private readonly _storedFileName: string;

  /**
   * Đường dẫn nội bộ đến file phiên bản lịch sử.
   */
  private readonly _filePath: string;

  /**
   * ID người dùng đã tạo phiên bản này.
   */
  private readonly _uploadedByUserId: string;

  /**
   * Thời điểm tạo phiên bản này.
   */
  private readonly _uploadedAt: Date;

  /**
   * Khởi tạo một AssetHistory.
   *
   * @param id - ID duy nhất
   * @param assetId - ID của tài sản chứa phiên bản lịch sử
   * @param version - Số phiên bản
   * @param storedFileName - Tên file được lưu trữ
   * @param filePath - Đường dẫn file
   * @param uploadedByUserId - ID người dùng đã tạo phiên bản
   * @param uploadedAt - Thời điểm tạo phiên bản
   */
  constructor(
    id: string,
    assetId: string,
    version: number,
    storedFileName: string,
    filePath: string,
    uploadedByUserId: string,
    uploadedAt: Date = new Date()
  ) {
    this._id = id;
    this._assetId = assetId;
    this._version = version;
    this._storedFileName = storedFileName;
    this._filePath = filePath;
    this._uploadedByUserId = uploadedByUserId;
    this._uploadedAt = uploadedAt;
  }

  /**
   * Lấy ID của phiên bản lịch sử.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Lấy ID của tài sản chứa phiên bản lịch sử.
   */
  get assetId(): string {
    return this._assetId;
  }

  /**
   * Lấy số phiên bản.
   */
  get version(): number {
    return this._version;
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
   * Lấy ID người dùng đã tạo phiên bản.
   */
  get uploadedByUserId(): string {
    return this._uploadedByUserId;
  }

  /**
   * Lấy thời điểm tạo phiên bản.
   */
  get uploadedAt(): Date {
    return new Date(this._uploadedAt);
  }

  /**
   * Tạo một bản sao của phiên bản lịch sử.
   *
   * @returns Bản sao của phiên bản lịch sử
   */
  clone(): AssetHistory {
    return new AssetHistory(
      this._id,
      this._assetId,
      this._version,
      this._storedFileName,
      this._filePath,
      this._uploadedByUserId,
      new Date(this._uploadedAt)
    );
  }
}
