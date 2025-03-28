import { IQuery } from '@nestjs/cqrs';

/**
 * Query lấy thông tin người dùng theo ID.
 */
export class GetUserByIdQuery implements IQuery {
  /**
   * Tạo query lấy thông tin người dùng theo ID.
   * @param id - ID của người dùng
   */
  constructor(
    public readonly id: string
  ) {}
} 