import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { IUserDto, UserDto } from '../../../dtos';
import { UserNotFoundError } from '../../../errors';
import { GetUserByEmailQuery } from './get-user-by-email.query';

/**
 * Handler xử lý query lấy thông tin người dùng theo email.
 */
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery, UserDto> {
  /**
   * Constructor.
   * @param userRepository - Repository quản lý User Aggregate
   */
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Thực thi query lấy thông tin người dùng theo email.
   * @param query - Query lấy thông tin người dùng
   * @returns UserDTO - Thông tin người dùng
   */
  async execute(query: GetUserByEmailQuery): Promise<UserDto> {
    const { email } = query;

    // Tìm user theo email
    const emailObj = new Email(email);
    const user = await this.userRepository.findByEmail(emailObj);

    if (!user) {
      throw new UserNotFoundError(email);
    }

    // Trả về UserDTO
    const userDto: IUserDto = {
      id: user.getId(),
      email: user.email.toString(),
      status: user.status,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      locale: user.profile.locale,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return new UserDto(userDto);
  }
}
