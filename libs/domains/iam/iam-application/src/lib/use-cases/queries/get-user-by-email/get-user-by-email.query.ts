import { AbstractQuery } from '@ecoma/common-application';

/**
 * Query yêu cầu lấy thông tin người dùng theo email.
 */
export class GetUserByEmailQuery extends AbstractQuery {
  /**
   * Tạo một query lấy thông tin người dùng theo email.
   * @param email - Email của người dùng
   */
  constructor(
    public readonly email: string
  ) {
    super({
      version: '1.0',
      language: 'vi'
    });
  }
}
