import { IAssetRepository, IExternalStorageService } from '@ecoma/dam-domain';
import { IQueryHandler } from '../../interfaces/query-handler.interface';
import { AssetDto } from '../../dtos/asset.dto';

/**
 * Query để lấy danh sách tài sản.
 */
export class GetAssetsQuery {
  /**
   * ID của tổ chức để lọc. Null để lấy tài sản nội bộ.
   */
  tenantId?: string | null;

  /**
   * ID của thư mục để lọc. Null để lấy tài sản không thuộc thư mục nào.
   * Undefined để không lọc theo thư mục.
   */
  folderId?: string | null;

  /**
   * Trạng thái tài sản để lọc.
   */
  status?: string;

  /**
   * Từ khóa tìm kiếm trong tên file và metadata.
   */
  searchTerm?: string;

  /**
   * Loại MIME để lọc.
   */
  mimeType?: string;

  /**
   * Số trang (bắt đầu từ 1).
   */
  page = 1;

  /**
   * Số lượng kết quả mỗi trang.
   */
  limit = 20;

  /**
   * Trường sắp xếp.
   */
  sortBy?: string;

  /**
   * Hướng sắp xếp (asc hoặc desc).
   */
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * Kết quả của việc lấy danh sách tài sản.
 */
export interface GetAssetsResult {
  /**
   * Danh sách tài sản.
   */
  items: AssetDto[];

  /**
   * Tổng số tài sản phù hợp với điều kiện lọc.
   */
  total: number;

  /**
   * Trang hiện tại.
   */
  page: number;

  /**
   * Số lượng kết quả mỗi trang.
   */
  limit: number;
}

/**
 * Handler cho GetAssetsQuery.
 */
export class GetAssetsQueryHandler implements IQueryHandler<GetAssetsQuery, GetAssetsResult> {
  /**
   * Khởi tạo handler với các dependencies.
   *
   * @param assetRepository - Repository cho Asset aggregate
   * @param externalStorageService - Service lưu trữ file bên ngoài
   */
  constructor(
    private readonly assetRepository: IAssetRepository,
    private readonly externalStorageService: IExternalStorageService
  ) {}

  /**
   * Xử lý query lấy danh sách tài sản.
   *
   * @param query - Query cần xử lý
   * @returns Promise với kết quả danh sách tài sản
   */
  async execute(query: GetAssetsQuery): Promise<GetAssetsResult> {
    // Triển khai xử lý query lấy danh sách tài sản
    // 1. Xây dựng điều kiện lọc
    // 2. Lấy danh sách tài sản từ repository
    // 3. Chuyển đổi sang DTO và trả về

    // TODO: Triển khai chi tiết logic lấy danh sách tài sản

    // Trả về kết quả giả định
    return {
      items: [
        {
          id: 'asset-1',
          tenantId: query.tenantId || null,
          originalFileName: 'example.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024,
          uploadedByUserId: 'user-1',
          uploadedAt: new Date(),
          status: 'Active',
          currentVersion: 1,
          folderId: query.folderId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: { title: 'Example Asset' },
        }
      ],
      total: 1,
      page: query.page,
      limit: query.limit,
    };
  }
}
