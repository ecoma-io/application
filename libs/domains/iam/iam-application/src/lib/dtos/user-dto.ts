import { UserStatus } from '@ecoma/iam-domain';

/**
 * DTO cho thông tin User.
 */
export interface IUserDto {
  /**
   * ID của người dùng.
   */
  id: string;

  /**
   * Email của người dùng.
   */
  email: string;

  /**
   * Họ của người dùng.
   */
  firstName: string;

  /**
   * Tên của người dùng.
   */
  lastName: string;

  /**
   * Mã locale của người dùng.
   */
  locale: string;

  /**
   * Trạng thái người dùng.
   */
  status: UserStatus;

  /**
   * Thời điểm tạo người dùng.
   */
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  updatedAt: Date;
}

/**
 * Concrete implementation of IUserDto
 */
export class UserDto implements IUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUserDto) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.locale = data.locale;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
