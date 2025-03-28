import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { IUserDto, UserDto } from '../../../dtos';
import { UserNotFoundError } from '../../../errors';

/**
 * Handler xử lý query lấy thông tin người dùng theo ID.
 */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, UserDto> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Xử lý query lấy thông tin người dùng theo ID.
   * @param query - Query lấy thông tin người dùng theo ID
   * @returns UserDto - Thông tin người dùng
   */
  async execute(query: GetUserByIdQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const userDto: IUserDto = {
      id: user.getId(),
      email: user.email.toString(),
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      locale: user.profile.locale,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return new UserDto(userDto);
  }
}
