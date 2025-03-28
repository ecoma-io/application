/**
 * Command cho việc tạo một TranslationSet mới
 */
export class CreateTranslationSetCommand {
  /**
   * @param name Tên định danh duy nhất của tập bản dịch
   * @param description Mô tả tùy chọn về tập bản dịch
   */
  constructor(
    public readonly name: string,
    public readonly description?: string
  ) {}
}

/**
 * Command cho việc cập nhật thông tin một TranslationSet
 */
export class UpdateTranslationSetCommand {
  /**
   * @param id ID của tập bản dịch cần cập nhật
   * @param name Tên mới của tập bản dịch
   * @param description Mô tả mới của tập bản dịch
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string
  ) {}
}

/**
 * Command cho việc xóa một TranslationSet
 */
export class DeleteTranslationSetCommand {
  /**
   * @param id ID của tập bản dịch cần xóa
   */
  constructor(
    public readonly id: string
  ) {}
}

/**
 * Command cho việc kích hoạt một TranslationSet
 */
export class ActivateTranslationSetCommand {
  /**
   * @param id ID của tập bản dịch cần kích hoạt
   */
  constructor(
    public readonly id: string
  ) {}
}

/**
 * Command cho việc vô hiệu hóa một TranslationSet
 */
export class DeactivateTranslationSetCommand {
  /**
   * @param id ID của tập bản dịch cần vô hiệu hóa
   */
  constructor(
    public readonly id: string
  ) {}
}
