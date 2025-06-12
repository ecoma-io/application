import { Page } from '@playwright/test';
import mongoose, { ObjectId } from 'mongoose';
import { TestDataGenerator } from './test-data-generator';
import { v7 as uuidv7 } from 'uuid';

export class TestHelpers {
  static async createUser(mongoConnection: any, userData: any) {
    return await mongoConnection.collection('users').insertOne(userData);
  }

  static async createOtp(mongoConnection: any, otpData: any) {
    return await mongoConnection.collection('otps').insertOne(otpData);
  }

  static async createSesssion(mongoConnection: any, sessionData: any) {
    return await mongoConnection.collection('seesions').insertOne(sessionData);
  }

  static async updateOtpExpiry(mongoConnection: any, otpId: ObjectId, expiryDate: Date) {
    return await mongoConnection.db.collection('otps').updateOne({ _id: otpId }, { $set: { expiresAt: expiryDate } });
  }

  static async updateOtpCreatedAt(mongoConnection: any, userId: ObjectId, createdAt: Date) {
    return await mongoConnection.db.collection('otps').updateOne({ userId, isUsed: false }, { $set: { createdAt } });
  }

  static async findUser(mongoConnection: any, email: string) {
    return await mongoConnection.db.collection('users').findOne({ email });
  }

  static async findOtp(mongoConnection: any, userId: ObjectId) {
    return await mongoConnection.db.collection('otps').findOne({ userId, isUsed: false });
  }

  static async setupAuth(page: Page, iamMongoConnection: mongoose.Connection) {
    // Generate test user data
    const testUser = TestDataGenerator.generateUserData();

    const userId = (await TestHelpers.createUser(iamMongoConnection, testUser)).insertedId;

    // Create session
    const token = uuidv7();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours
    await iamMongoConnection.collection('sessions').insertOne({
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set cookies
    const baseDomain = '.' + process.env['BASE_DOMAIN'];

    await page.context().addCookies([
      {
        name: 'TOKEN',
        value: token,
        domain: baseDomain,
        path: '/',
        sameSite: 'None',
        expires: -1,
        httpOnly: false,
        secure: true,
      },
      {
        name: 'USER',
        value: JSON.stringify({
          id: userId.toString(),
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        }),
        domain: baseDomain,
        path: '/',
        sameSite: 'None',
        expires: -1,
        httpOnly: false,
        secure: true,
      },
    ]);
  }
}
