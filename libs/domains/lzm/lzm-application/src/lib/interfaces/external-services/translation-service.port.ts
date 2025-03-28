/**
 * Interface định nghĩa port cho dịch vụ dịch thuật tự động bên ngoài
 */
export interface ITranslationServicePort {
  /**
   * Dịch một đoạn văn bản sang ngôn ngữ đích
   * @param text Văn bản cần dịch
   * @param sourceLocale Locale nguồn
   * @param targetLocale Locale đích
   * @returns Promise với bản dịch
   */
  translateText(
    text: string,
    sourceLocale: string,
    targetLocale: string
  ): Promise<string>;

  /**
   * Dịch nhiều đoạn văn bản sang nhiều ngôn ngữ đích
   * @param texts Mảng các văn bản cần dịch
   * @param sourceLocale Locale nguồn
   * @param targetLocales Mảng các locale đích
   * @returns Promise với map kết quả, key là locale, value là mảng các bản dịch theo thứ tự trong texts
   */
  batchTranslate(
    texts: string[],
    sourceLocale: string,
    targetLocales: string[]
  ): Promise<Record<string, string[]>>;

  /**
   * Phát hiện ngôn ngữ của văn bản
   * @param text Văn bản cần phát hiện ngôn ngữ
   * @returns Promise với locale được phát hiện
   */
  detectLanguage(text: string): Promise<string>;

  /**
   * Kiểm tra mức độ tin cậy của bản dịch
   * @param sourceText Văn bản nguồn
   * @param translatedText Văn bản đã dịch
   * @param sourceLocale Locale nguồn
   * @param targetLocale Locale đích
   * @returns Promise với điểm số tin cậy (0-1)
   */
  assessTranslationQuality(
    sourceText: string,
    translatedText: string,
    sourceLocale: string,
    targetLocale: string
  ): Promise<number>;
}
