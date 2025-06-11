import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../schemas';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>
  ) {}

  public async findById(sessionId: string) {
    return this.sessionModel.findById(sessionId).exec();
  }

  public async findByToken(token: string) {
    return this.sessionModel.findOne({ token }).exec();
  }

  public async create(session: Omit<Session, 'id' | 'createdAt'>) {
    return this.sessionModel.create(session);
  }

  public async deleteById(sessionId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findByIdAndDelete(sessionId).exec();
  }

  public async deleteByToken(token: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOneAndDelete({ token }).exec();
  }
}
