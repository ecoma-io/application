/**
 * Lỗi khi không tìm thấy TranslationSet.
 */
export class TranslationSetNotFoundException extends Error {
  /**
   * Khởi tạo một exception mới khi không tìm thấy TranslationSet.
   * @param id ID của TranslationSet không tìm thấy
   */
  constructor(id: string) {
    super(`Không tìm thấy TranslationSet với ID: ${id}`);
    this.name = 'TranslationSetNotFoundException';
  }
}

/**
 * Lỗi khi tên TranslationSet đã tồn tại.
 */
export class TranslationSetNameAlreadyExistsException extends Error {
  /**
   * Khởi tạo một exception mới khi tên TranslationSet đã tồn tại.
   * @param name Tên đã tồn tại
   */
  constructor(name: string) {
    super(`TranslationSet với tên "${name}" đã tồn tại`);
    this.name = 'TranslationSetNameAlreadyExistsException';
  }
}

/**
 * Lỗi khi TranslationSet không hợp lệ.
 */
export class InvalidTranslationSetException extends Error {
  /**
   * Khởi tạo một exception mới khi TranslationSet không hợp lệ.
   * @param message Thông báo lỗi
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTranslationSetException';
  }
}
