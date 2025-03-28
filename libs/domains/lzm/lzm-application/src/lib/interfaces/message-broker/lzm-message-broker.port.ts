/**
 * Interface định nghĩa tất cả các port message broker cho LZM
 */
export interface ILzmMessageBrokerPort {
  /**
   * Phát một sự kiện TranslationSet
   * @param event Sự kiện cần phát
   * @returns Promise void
   */
  publishTranslationSetEvent(event: unknown): Promise<void>;

  /**
   * Phát một sự kiện TranslationKey
   * @param event Sự kiện cần phát
   * @returns Promise void
   */
  publishTranslationKeyEvent(event: unknown): Promise<void>;

  /**
   * Phát một sự kiện Translation
   * @param event Sự kiện cần phát
   * @returns Promise void
   */
  publishTranslationEvent(event: unknown): Promise<void>;

  /**
   * Thêm nhiều bản dịch vào hàng đợi xử lý tự động
   * @param keyIds Danh sách ID của các khóa cần dịch
   * @param targetLocales Danh sách locale đích cần dịch sang
   * @returns Promise void
   */
  enqueueAutomaticTranslation(keyIds: string[], targetLocales: string[]): Promise<void>;
}
