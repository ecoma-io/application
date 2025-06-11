import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationTemplate, NotificationTemplateDocument } from '../schemas/notification-template.schema';

@Injectable()
export class NotificationTemplateRepository {
  constructor(
    @InjectModel(NotificationTemplate.name)
    private readonly templateModel: Model<NotificationTemplateDocument>,
  ) {}

  async findAll(): Promise<NotificationTemplateDocument[]> {
    return this.templateModel.find().exec();
  }

  async findByName(name: string): Promise<NotificationTemplateDocument | null> {
    return this.templateModel.findOne({ name }).exec();
  }

  async create(data: Partial<NotificationTemplate>): Promise<NotificationTemplateDocument> {
    return this.templateModel.create(data);
  }

  async updateByName(name: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplateDocument | null> {
    return this.templateModel.findOneAndUpdate({ name }, data, { new: true }).exec();
  }

  async deleteByName(name: string): Promise<{ deletedCount?: number }> {
    return this.templateModel.deleteOne({ name }).exec();
  }
}
