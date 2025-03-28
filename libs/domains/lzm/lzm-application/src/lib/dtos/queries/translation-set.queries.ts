/**
 * Query để lấy thông tin một TranslationSet theo ID
 */
export class GetTranslationSetByIdQuery {
  /**
   * @param id ID của tập bản dịch cần lấy
   * @param includeKeys Có bao gồm danh sách khóa bản dịch không
   */
  constructor(
    public readonly id: string,
    public readonly includeKeys: boolean = false
  ) {}
}

/**
 * Query để lấy thông tin một TranslationSet theo tên
 */
export class GetTranslationSetByNameQuery {
  /**
   * @param name Tên của tập bản dịch cần lấy
   * @param includeKeys Có bao gồm danh sách khóa bản dịch không
   */
  constructor(
    public readonly name: string,
    public readonly includeKeys: boolean = false
  ) {}
}

/**
 * Query để lấy danh sách tất cả TranslationSet
 */
export class GetAllTranslationSetsQuery {
  /**
   * @param page Số trang (bắt đầu từ 0)
   * @param limit Số lượng item trên mỗi trang
   * @param includeInactive Có bao gồm các tập bản dịch không hoạt động không
   */
  constructor(
    public readonly page: number = 0,
    public readonly limit: number = 10,
    public readonly includeInactive: boolean = false
  ) {}
}

/**
 * Query để tìm kiếm các TranslationSet
 */
export class SearchTranslationSetsQuery {
  /**
   * @param searchTerm Từ khóa tìm kiếm (tên hoặc mô tả)
   * @param page Số trang (bắt đầu từ 0)
   * @param limit Số lượng item trên mỗi trang
   * @param includeInactive Có bao gồm các tập bản dịch không hoạt động không
   */
  constructor(
    public readonly searchTerm: string,
    public readonly page: number = 0,
    public readonly limit: number = 10,
    public readonly includeInactive: boolean = false
  ) {}
}
