/**
 * Đại diện cho sự kiện khi một tập bản dịch mới được tạo.
 */
export class TranslationSetCreatedEvent {
  /**
   * Khởi tạo một sự kiện TranslationSetCreated mới.
   * @param setId ID của tập bản dịch
   * @param name Tên của tập bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly setId: string,
    public readonly name: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một tập bản dịch được cập nhật.
 */
export class TranslationSetUpdatedEvent {
  /**
   * Khởi tạo một sự kiện TranslationSetUpdated mới.
   * @param setId ID của tập bản dịch
   * @param name Tên của tập bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly setId: string,
    public readonly name: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một tập bản dịch bị xóa.
 */
export class TranslationSetDeletedEvent {
  /**
   * Khởi tạo một sự kiện TranslationSetDeleted mới.
   * @param setId ID của tập bản dịch
   * @param name Tên của tập bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly setId: string,
    public readonly name: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}
