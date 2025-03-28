import { AbstractAggregateRoot } from '../abstract-aggregate-root';
import { AccessPermission } from '../../value-objects/access-permission.value-object';

/**
 * Aggregate Root đại diện cho một thư mục trong hệ thống tổ chức tài sản kỹ thuật số.
 */
export class Folder extends AbstractAggregateRoot {
  /**
   * ID duy nhất của thư mục.
   */
  private readonly _id: string;

  /**
   * ID của tổ chức sở hữu thư mục. Null cho thư mục nội bộ.
   */
  private readonly _tenantId: string | null;

  /**
   * Tên thư mục.
   */
  private _name: string;

  /**
   * Mô tả thư mục, tùy chọn.
   */
  private _description: string | null;

  /**
   * ID của thư mục cha. Null cho thư mục gốc.
   */
  private _parentFolderId: string | null;

  /**
   * Đường dẫn đầy đủ của thư mục, phân cách bằng '/'.
   */
  private _path: string;

  /**
   * ID của người dùng đã tạo thư mục.
   */
  private readonly _createdByUserId: string;

  /**
   * Thời điểm tạo thư mục.
   */
  private readonly _createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  private _updatedAt: Date;

  /**
   * Thứ tự sắp xếp trong thư mục cha.
   */
  private _sortOrder: number;

  /**
   * Khởi tạo một Folder.
   *
   * @param id - ID duy nhất
   * @param tenantId - ID của tổ chức (null cho thư mục nội bộ)
   * @param name - Tên thư mục
   * @param description - Mô tả thư mục (tùy chọn)
   * @param parentFolderId - ID của thư mục cha (null cho thư mục gốc)
   * @param path - Đường dẫn đầy đủ của thư mục
   * @param createdByUserId - ID người dùng đã tạo thư mục
   * @param sortOrder - Thứ tự sắp xếp
   * @param createdAt - Thời điểm tạo
   * @param updatedAt - Thời điểm cập nhật cuối cùng
   */
  constructor(
    id: string,
    tenantId: string | null,
    name: string,
    description: string | null = null,
    parentFolderId: string | null = null,
    path: string,
    createdByUserId: string,
    sortOrder = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super();
    this._id = id;
    this._tenantId = tenantId;
    this._name = name;
    this._description = description;
    this._parentFolderId = parentFolderId;
    this._path = path;
    this._createdByUserId = createdByUserId;
    this._sortOrder = sortOrder;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Lấy ID của thư mục.
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
   * Lấy tên thư mục.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Lấy mô tả thư mục.
   */
  get description(): string | null {
    return this._description;
  }

  /**
   * Lấy ID của thư mục cha.
   */
  get parentFolderId(): string | null {
    return this._parentFolderId;
  }

  /**
   * Lấy đường dẫn đầy đủ của thư mục.
   */
  get path(): string {
    return this._path;
  }

  /**
   * Lấy ID người dùng đã tạo thư mục.
   */
  get createdByUserId(): string {
    return this._createdByUserId;
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
   * Lấy thứ tự sắp xếp.
   */
  get sortOrder(): number {
    return this._sortOrder;
  }

  /**
   * Cập nhật thông tin thư mục.
   *
   * @param name - Tên thư mục mới
   * @param description - Mô tả thư mục mới
   */
  update(name: string, description: string | null = null): void {
    if (this._name !== name || this._description !== description) {
      this._name = name;
      this._description = description;
      this._updateTimestamp();

      // TODO: Phát domain event FolderUpdated
    }
  }

  /**
   * Di chuyển thư mục đến một thư mục cha khác.
   *
   * @param parentFolderId - ID của thư mục cha mới (null cho thư mục gốc)
   * @param newPath - Đường dẫn mới sau khi di chuyển
   */
  move(parentFolderId: string | null, newPath: string): void {
    if (this._parentFolderId !== parentFolderId || this._path !== newPath) {
      const oldParentFolderId = this._parentFolderId;
      const oldPath = this._path;

      this._parentFolderId = parentFolderId;
      this._path = newPath;
      this._updateTimestamp();

      // TODO: Phát domain event FolderMoved
    }
  }

  /**
   * Cập nhật thứ tự sắp xếp của thư mục.
   *
   * @param sortOrder - Thứ tự sắp xếp mới
   */
  updateSortOrder(sortOrder: number): void {
    if (this._sortOrder !== sortOrder) {
      this._sortOrder = sortOrder;
      this._updateTimestamp();

      // TODO: Phát domain event FolderSortOrderUpdated
    }
  }

  /**
   * Kiểm tra xem thư mục có phải là thư mục gốc không.
   *
   * @returns true nếu là thư mục gốc (parentFolderId là null)
   */
  isRoot(): boolean {
    return this._parentFolderId === null;
  }

  /**
   * Kiểm tra xem thư mục có phải là thư mục nội bộ không.
   *
   * @returns true nếu là thư mục nội bộ (tenantId là null)
   */
  isInternal(): boolean {
    return this._tenantId === null;
  }

  /**
   * Tạo đường dẫn thư mục cho một thư mục con.
   *
   * @param childName - Tên của thư mục con
   * @returns Đường dẫn đầy đủ của thư mục con
   */
  createChildPath(childName: string): string {
    return `${this._path}/${childName}`;
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
