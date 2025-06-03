import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OTP, OTPDocument } from '../schemas';

/**
 * Repository for interacting with the OTP collection.
 * Handles operations related to One-Time Passwords.
 */
@Injectable()
export class OTPRepository {
  /**
   * @param otpModel Mongoose model for OTP documents.
   */
  constructor(
    @InjectModel(OTP.name)
    private readonly otpModel: Model<OTPDocument>,
  ) {}

  /**
   * Finds the single unused OTP document for a given user.
   * Leverages the unique partial index on userId and isUsed=false.
   *
   * @param {Types.ObjectId} userId - The ID of the user.
   * @returns {Promise<OTPDocument | null>} A promise that resolves with the unused OTP document, or null if none is found.
   */
  public async findUnusedByUserId(userId: Types.ObjectId): Promise<OTPDocument | null> {
    return this.otpModel.findOne({ userId, isUsed: false }).exec();
  }

  /**
   * Finds an OTP document by user ID and code, and checks if it's valid (unused and not expired).
   *
   * @param {Types.ObjectId} userId - The ID of the user.
   * @param {string} code - The OTP code to validate.
   * @returns {Promise<OTPDocument | null>} A promise that resolves with the valid OTP document, or null if not found, used, or expired.
   */
  public async findValidOtp(userId: Types.ObjectId, code: string): Promise<OTPDocument | null> {
    const now = new Date();
    // Find OTP that matches userId and code, is not used, and has not expired
    return this.otpModel.findOne({
      userId: userId,
      code: code,
      isUsed: false,
      expiresAt: { $gt: now }, // Check if expiresAt is greater than now
    }).exec();
  }

  /**
   * Finds an existing unused OTP for a user and updates it, or creates a new OTP if none is found.
   * Due to schema constraints (unique index on userId with partialFilterExpression: { isUsed: false }),
   * this method effectively manages the single active unused OTP per user.
   *
   * @param {object} params - Parameters for creating or updating the OTP.
   * @param {Types.ObjectId} params.userId - The ID of the user associated with the OTP.
   * @param {string} params.token - The OTP code.
   * @param {Date} params.expiresAt - The expiration date and time for the OTP.
   * @param {boolean} params.isUsed - The usage status of the OTP (true if used, false otherwise).
   * @returns {Promise<OTPDocument>} A promise that resolves with the created or updated OTP document.
   */
  public async createOrUpdateOtp({ userId, token, expiresAt, isUsed }: { userId: Types.ObjectId, token: string, expiresAt: Date, isUsed: boolean }) {
    const otpDoc = await this.otpModel.findOne({ userId, isUsed: false });
    if (otpDoc) {
      otpDoc.code = token;
      otpDoc.expiresAt = expiresAt;
      otpDoc.isUsed = isUsed;
      await otpDoc.save();
      return otpDoc;
    } else {
      return this.otpModel.create({ userId, code: token, expiresAt, isUsed });
    }
  }
}
