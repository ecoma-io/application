import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../schemas';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) { }

  public async findByUserIdAndSessionId(userId: Types.ObjectId, sessionId: string): Promise<SessionDocument | null> {
     
    return this.sessionModel.findOne({ user: userId, _id: sessionId }).exec();
  }

  public async deleteById(sessionId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findByIdAndDelete(sessionId).exec();
  }

  public async create(session: Omit<Session, 'id' | 'createdAt'>) {
    return this.sessionModel.create(session);
  }

  public async delete(sessionId: string) {
     
    return this.sessionModel.deleteOne({ _id: sessionId });
  }

  public async findById(sessionId: string) {
    return this.sessionModel.findById(sessionId);
  }
}
