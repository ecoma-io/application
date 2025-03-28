import { Injectable } from '@nestjs/common';
import { IRdmServicePort } from '@ecoma/domains/lzm/lzm-application';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

/**
 * Adapter triển khai IRdmServicePort để giao tiếp với RDM service
 */
@Injectable()
export class RdmServiceAdapter implements IRdmServicePort {
  /**
   * URL cơ sở của RDM service
   */
  private readonly baseUrl: string;

  /**
   * Khởi tạo adapter
   * @param httpService Service HTTP để gọi API
   * @param configService Service cấu hình
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('RDM_SERVICE_URL', 'http://rdm-service:3000');
  }

  /**
   * Lấy danh sách các locale được hỗ trợ từ RDM
   * @returns Promise với mảng các chuỗi locale
   */
  async getSupportedLocales(): Promise<string[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/v1/locales/supported`)
    );
    return response.data.locales;
  }

  /**
   * Lấy locale ngôn ngữ gốc của hệ thống từ RDM
   * @returns Promise với chuỗi locale gốc
   */
  async getSourceLanguage(): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/v1/locales/source`)
    );
    return response.data.locale;
  }

  /**
   * Kiểm tra xem một locale có được hỗ trợ bởi hệ thống không
   * @param locale Locale cần kiểm tra
   * @returns Promise với true nếu locale được hỗ trợ, false nếu không
   */
  async isLocaleSupported(locale: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api/v1/locales/${locale}/supported`)
      );
      return response.data.supported;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Lấy thông tin định dạng cho một locale
   * @param locale Locale cần lấy thông tin định dạng
   * @returns Promise với đối tượng chứa thông tin định dạng
   */
  async getLocaleFormatInfo(locale: string): Promise<{
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
  }> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/v1/locales/${locale}/format`)
    );
    return response.data;
  }

  /**
   * Lấy danh sách tất cả các ngôn ngữ được hỗ trợ và thông tin của chúng
   * @returns Promise với mảng thông tin ngôn ngữ
   */
  async getAllLanguages(): Promise<{
    locale: string;
    name: string;
    nativeName: string;
    isRightToLeft: boolean;
    isDefault: boolean;
    isEnabled: boolean;
  }[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/v1/languages`)
    );
    return response.data.languages;
  }

  /**
   * Lấy thông tin chi tiết về một ngôn ngữ
   * @param locale Locale cần lấy thông tin
   * @returns Promise với thông tin chi tiết về ngôn ngữ
   */
  async getLanguageInfo(locale: string): Promise<{
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
  } | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api/v1/languages/${locale}`)
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
