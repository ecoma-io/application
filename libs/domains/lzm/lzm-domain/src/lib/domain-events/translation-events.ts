/**
 * Đại diện cho sự kiện khi một bản dịch mới được tạo.
 */
export class TranslationAddedEvent {
  /**
   * Khởi tạo một sự kiện TranslationAdded mới.
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale của bản dịch
   * @param translationId ID của bản dịch
   * @param content Nội dung của bản dịch
   * @param status Trạng thái của bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly locale: string,
    public readonly translationId: string,
    public readonly content: string,
    public readonly status: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một bản dịch được cập nhật.
 */
export class TranslationUpdatedEvent {
  /**
   * Khởi tạo một sự kiện TranslationUpdated mới.
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale của bản dịch
   * @param translationId ID của bản dịch
   * @param content Nội dung của bản dịch
   * @param status Trạng thái của bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly locale: string,
    public readonly translationId: string,
    public readonly content: string,
    public readonly status: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi trạng thái của một bản dịch thay đổi.
 */
export class TranslationStatusChangedEvent {
  /**
   * Khởi tạo một sự kiện TranslationStatusChanged mới.
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale của bản dịch
   * @param translationId ID của bản dịch
   * @param oldStatus Trạng thái cũ của bản dịch
   * @param newStatus Trạng thái mới của bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly locale: string,
    public readonly translationId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}

/**
 * Đại diện cho sự kiện khi một bản dịch bị xóa.
 */
export class TranslationRemovedEvent {
  /**
   * Khởi tạo một sự kiện TranslationRemoved mới.
   * @param keyId ID của khóa bản dịch
   * @param locale Mã locale của bản dịch
   * @param translationId ID của bản dịch
   * @param issuedAt Thời điểm phát sinh sự kiện
   */
  constructor(
    public readonly keyId: string,
    public readonly locale: string,
    public readonly translationId: string,
    public readonly issuedAt: Date = new Date(),
  ) {}
}
