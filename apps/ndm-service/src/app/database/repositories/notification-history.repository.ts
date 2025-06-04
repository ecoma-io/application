import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationHistory, NotificationHistoryDocument, NotificationStatus } from '../schemas/notification-history.schema';

@Injectable()
export class NotificationHistoryRepository {
  constructor(
    @InjectModel(NotificationHistory.name)
    private readonly historyModel: Model<NotificationHistoryDocument>,
  ) {}

  async create(data: Partial<NotificationHistory>): Promise<NotificationHistoryDocument> {
    return this.historyModel.create(data);
  }

  async findAll(): Promise<NotificationHistoryDocument[]> {
    return this.historyModel.find().exec();
  }

  async findById(id: string): Promise<NotificationHistoryDocument | null> {
    return this.historyModel.findById(id).exec();
  }

  async findByUser(userId: Types.ObjectId): Promise<NotificationHistoryDocument[]> {
    return this.historyModel.find({ userId }).exec();
  }

  async findByEmail(email: string): Promise<NotificationHistoryDocument[]> {
    return this.historyModel.find({ email }).exec();
  }

  async findByStatus(status: NotificationStatus): Promise<NotificationHistoryDocument[]> {
    return this.historyModel.find({ status }).exec();
  }
}
