import { ObjectId } from 'mongoose';

export class TestDataGenerator {
  private static generateRandomString(length: number): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateUniqueEmail(): string {
    return `${Date.now()}_${this.generateRandomString(6)}@example.com`;
  }

  static generateUserData() {
    const email = this.generateUniqueEmail();
    return {
      email,
      firstName: `User`,
      lastName: `${this.generateRandomString(6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static generateOtpData(userId: ObjectId) {
    return {
      userId,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      isUsed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    };
  }

  static generateExpiredOtpData(userId: ObjectId) {
    return {
      userId,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      isUsed: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      expiresAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    };
  }
}
