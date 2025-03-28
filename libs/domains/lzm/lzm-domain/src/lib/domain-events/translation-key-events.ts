/**
 * Đại diện cho sự kiện khi một khóa bản dịch mới được tạo/thêm vào tập.
 */
export class TranslationKeyAddedEvent {
  /**
   * Khởi tạo một sự kiện TranslationKeyAdded mới.
   * @param keyId ID của khóa bản dịch
   * @param key Chuỗi định danh của khóa bản dịch
   * @param setId ID của tập bản dịch chứa khóa này
   * @param sourceContent Nội dung gốc của khóa bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly key: string,
    public readonly setId: string,
    public readonly sourceContent: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một khóa bản dịch được cập nhật.
 */
export class TranslationKeyUpdatedEvent {
  /**
   * Khởi tạo một sự kiện TranslationKeyUpdated mới.
   * @param keyId ID của khóa bản dịch
   * @param key Chuỗi định danh của khóa bản dịch
   * @param sourceContent Nội dung gốc mới của khóa bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly key: string,
    public readonly sourceContent: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một khóa bản dịch bị xóa.
 */
export class TranslationKeyRemovedEvent {
  /**
   * Khởi tạo một sự kiện TranslationKeyRemoved mới.
   * @param keyId ID của khóa bản dịch
   * @param key Chuỗi định danh của khóa bản dịch
   * @param setId ID của tập bản dịch chứa khóa này
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly key: string,
    public readonly setId: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}
