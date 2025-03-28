/**
 * Interface định nghĩa các phương thức tương tác với Reference Data Management (RDM)
 * để lấy thông tin về Locale và Ngôn ngữ Gốc.
 */
export interface IRdmService {
  /**
   * Lấy danh sách các locale được hỗ trợ từ RDM.
   * @returns Promise với mảng các chuỗi locale (vd: ['vi-VN', 'en-US'])
   */
  getSupportedLocales(): Promise<string[]>;

  /**
   * Lấy locale ngôn ngữ gốc của hệ thống từ RDM.
   * @returns Promise với chuỗi locale gốc (vd: 'en-US')
   */
  getSourceLanguage(): Promise<string>;

  /**
   * Kiểm tra xem một locale có được hỗ trợ bởi hệ thống không.
   * @param locale Locale cần kiểm tra
   * @returns Promise với true nếu locale được hỗ trợ, false nếu không
   */
  isLocaleSupported(locale: string): Promise<boolean>;

  /**
   * Lấy thông tin định dạng cho một locale.
   * @param locale Locale cần lấy thông tin định dạng
   * @returns Promise với đối tượng chứa thông tin định dạng
   */
  getLocaleFormatInfo(locale: string): Promise<{
    dateFormat: string;
    timeFormat: string;
    numberFormat: {
      decimal: string;
      thousand: string;
      precision: number;
    };
    currencyFormat: {
      symbol: string;
      position: 'before' | 'after';
      space: boolean;
    };
  }>;
}
