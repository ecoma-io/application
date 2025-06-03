import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas';
import { PinoLogger } from '@ecoma/nestjs-logger';

@Injectable()
/**
 * Repository thao tác với user collection
 */
export class UserRepository {
  private readonly logger = new PinoLogger(UserRepository.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  /**
   * Tìm user theo email
   * @param email Email user
   */
  public async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.debug('Finding user by email', { email });
    return this.userModel.findOne({ email }).exec();
  }


  /**
   * Tạo user mới
   * @param user Thông tin user
   */
  public async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'isVerified' | 'isSuspended'>) {
    this.logger.info('Creating user in repository', { email: user.email });
    return this.userModel.create(user);
  }
}
