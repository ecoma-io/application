import { ObjectId } from 'mongoose';

export class TestHelpers {
  static async createUser(mongoConnection: any, userData: any) {
    return await mongoConnection.collection('users').insertOne(userData);
  }

  static async createOtp(mongoConnection: any, otpData: any) {
    return await mongoConnection.collection('otps').insertOne(otpData);
  }

  static async updateOtpExpiry(mongoConnection: any, otpId: ObjectId, expiryDate: Date) {
    return await mongoConnection.db.collection('otps').updateOne(
      { _id: otpId },
      { $set: { expiresAt: expiryDate } }
    );
  }

  static async updateOtpCreatedAt(mongoConnection: any, userId: ObjectId, createdAt: Date) {
    return await mongoConnection.db.collection('otps').updateOne(
      { userId, isUsed: false },
      { $set: { createdAt } }
    );
  }

  static async findUser(mongoConnection: any, email: string) {
    return await mongoConnection.db.collection('users').findOne({ email });
  }

  static async findOtp(mongoConnection: any, userId: ObjectId) {
    return await mongoConnection.db.collection('otps').findOne({ userId, isUsed: false });
  }

  static async clearCollections(mongoConnection: any) {
    await mongoConnection.db.collection('users').deleteMany({});
    await mongoConnection.db.collection('otps').deleteMany({});
  }
}
