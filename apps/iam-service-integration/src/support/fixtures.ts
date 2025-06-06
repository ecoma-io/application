import { ObjectId } from 'mongoose';
import { MongoDBContainer, RabbitMQContainer, StartedMongoDBContainer, StartedRabbitMQContainer, TestLogger } from "@ecoma/testing";
import { StartedTestContainer, GenericContainer, Wait } from "testcontainers";
import mongoose from "mongoose";
import * as amqp from 'amqplib';
import axios from 'axios';

// User fixtures
export const userFixtures = {
  newUser: {
    email: "testuser@example.com",
    firstName: "John",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  existingUser: {
    email: "existinguser@example.com",
    firstName: "Jane",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  rateLimitUser: {
    email: "ratelimituser@example.com",
    firstName: "Rate",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  rateLimitBypassUser: {
    email: "ratelimitbypassuser@example.com",
    firstName: "Bypass",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  signInUser: {
    email: "signinuser@example.com",
    firstName: "SignIn",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  invalidOtpUser: {
    email: "invalidotpuser@example.com",
    firstName: "Invalid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  expiredOtpUser: {
    email: "expiredotpuser@example.com",
    firstName: "Expired",
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// OTP fixtures
export const otpFixtures = {
  validOtp: (userId: ObjectId) => ({
    code: "123456",
    userId,
    isUsed: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  }),
  expiredOtp: (userId: ObjectId) => ({
    code: "654321",
    userId,
    isUsed: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    expiresAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  }),
  rateLimitBypassOtp: (userId: ObjectId) => ({
    code: "789012",
    userId,
    isUsed: false,
    createdAt: new Date(Date.now() - 120 * 1000), // 2 minutes ago
    expiresAt: new Date(Date.now() + 3 * 60 * 1000) // 3 minutes from now
  })
};

// Test request fixtures
export const requestFixtures = {
  validEmail: "testuser@example.com",
  invalidEmail: "invalid-email-format",
  nonExistingEmail: "non-existing@example.com",
  extraFieldRequest: {
    email: "extrafielduser@example.com",
    extraField: "some data"
  }
};

// Helper functions for test setup
export const testHelpers = {
  createUser: async (mongoConnection: any, userData: any) => {
    return await mongoConnection.collection('users').insertOne(userData);
  },

  createOtp: async (mongoConnection: any, otpData: any) => {
    return await mongoConnection.collection('otps').insertOne(otpData);
  },

  updateOtpExpiry: async (mongoConnection: any, otpId: ObjectId, expiryDate: Date) => {
    return await mongoConnection.db.collection('otps').updateOne(
      { _id: otpId },
      { $set: { expiresAt: expiryDate } }
    );
  },

  updateOtpCreatedAt: async (mongoConnection: any, userId: ObjectId, createdAt: Date) => {
    return await mongoConnection.db.collection('otps').updateOne(
      { userId, isUsed: false },
      { $set: { createdAt } }
    );
  },

  findUser: async (mongoConnection: any, email: string) => {
    return await mongoConnection.db.collection('users').findOne({ email });
  },

  findOtp: async (mongoConnection: any, userId: ObjectId) => {
    return await mongoConnection.db.collection('otps').findOne({ userId, isUsed: false });
  },

  clearCollections: async (mongoConnection: any) => {
    await mongoConnection.db.collection("users").deleteMany({});
    await mongoConnection.db.collection("otps").deleteMany({});
  }
};

