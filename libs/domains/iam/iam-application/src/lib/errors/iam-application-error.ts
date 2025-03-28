import { AbstractApplicationError } from '@ecoma/common-application';

/**
 * Lớp lỗi cơ sở cho IAM Application.
 */
export class IamApplicationError extends AbstractApplicationError {
  public readonly code: string;
  public readonly statusCode: number;

  /**
   * Tạo một lỗi IAM Application mới.
   * @param message - Thông báo lỗi
   * @param code - Mã lỗi
   * @param statusCode - Mã HTTP nếu liên quan đến HTTP
   */
  constructor(message: string, code = 'IAM_APPLICATION_ERROR', statusCode = 400) {
    super(message);
    this.name = 'IamApplicationError';
    this.code = code;
    this.statusCode = statusCode;
  }
} 