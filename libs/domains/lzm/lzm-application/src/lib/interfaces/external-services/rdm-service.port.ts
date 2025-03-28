import { IRdmService } from '@ecoma/domains/lzm/lzm-domain';

/**
 * Interface định nghĩa port cho service ngoài RDM
 */
export interface IRdmServicePort extends IRdmService {
  /**
   * Lấy danh sách tất cả các ngôn ngữ được hỗ trợ và thông tin của chúng
   * @returns Promise với mảng thông tin ngôn ngữ
   */
  getAllLanguages(): Promise<{
    locale: string;
    name: string;
    nativeName: string;
    isRightToLeft: boolean;
    isDefault: boolean;
    isEnabled: boolean;
  }[]>;

  /**
   * Lấy thông tin chi tiết về một ngôn ngữ
   * @param locale Locale cần lấy thông tin
   * @returns Promise với thông tin chi tiết về ngôn ngữ
   */
  getLanguageInfo(locale: string): Promise<{
    locale: string;
    name: string;
    nativeName: string;
    isRightToLeft: boolean;
    isDefault: boolean;
    isEnabled: boolean;
    formatInfo: {
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
    };
  } | null>;
}
