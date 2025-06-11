import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'sessions',
})
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId | User;

  @Prop({ required: true, unique: true, index: true })
  token: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ type: Number, required: true })
  roleVersion: number;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop()
  createdAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);
