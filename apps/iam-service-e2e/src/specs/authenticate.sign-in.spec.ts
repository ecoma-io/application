import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import mongoose from 'mongoose';
import * as amqp from 'amqplib';
import { TestHelpers } from '../support/test-helpers';
import { TestDataGenerator } from '../support/test-data-generator';

let mongoConnection: mongoose.Connection;
let rabbitMqConnection: amqp.ChannelModel;
let rabbitMqChannel: amqp.Channel;

beforeAll(async () => {
  // Setup MongoDB connection
  mongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'], { dbName: 'iam' }).asPromise();

  // Setup RabbitMQ connection
  rabbitMqConnection = await amqp.connect(process.env['RABBITMQ_URI']);
  rabbitMqChannel = await rabbitMqConnection.createChannel();

  // Setup Axios with proper configuration
  axios.defaults.validateStatus = () => true; // Allow all status codes
});

afterAll(async () => {
  if (rabbitMqChannel) await rabbitMqChannel.close();
  if (rabbitMqConnection) await rabbitMqConnection.close();
  if (mongoConnection) await mongoConnection.close();
});

describe('Authenticate Sign In Feature', () => {
  it("should sign in successfully with valid OTP", async () => {
    // Generate test user data
    const userData = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(mongoConnection, userData);

    // Request OTP and get user
    await axios.post("https://iam.fbi.com/authenticate/request-otp", { email: userData.email });
    const user = await TestHelpers.findUser(mongoConnection, userData.email);
    const otpDoc = await TestHelpers.findOtp(mongoConnection, user._id);
    expect(otpDoc).toBeDefined();

    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: userData.email,
      otp: otpDoc.code
    });
    expect(response.status).toBe(HttpStatus.ACCEPTED);
    expect(response.data.data).toBeDefined();
    expect(response.data.data.token).toBeDefined();
    expect(response.data.data.id).toBeDefined();
    expect(response.data.data.email).toBe(userData.email);
  });

  it("should update user info when signing in with new firstName", async () => {
    // Generate test user data without firstName
    const userData = TestDataGenerator.generateUserData();
    delete userData.firstName;
    await TestHelpers.createUser(mongoConnection, userData);

    // Request OTP and get user
    await axios.post("https://iam.fbi.com/authenticate/request-otp", { email: userData.email });
    const user = await TestHelpers.findUser(mongoConnection, userData.email);
    const otpDoc = await TestHelpers.findOtp(mongoConnection, user._id);

    // Sign in with new firstName
    const newFirstName = "NewFirstName";
    const newLastName = "NewLastName";
    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: userData.email,
      otp: otpDoc.code,
      firstName: newFirstName,
      lastName: newLastName
    });

    // Verify response
    expect(response.status).toBe(HttpStatus.ACCEPTED);
    expect(response.data.data.firstName).toBe(newFirstName);
    expect(response.data.data.lastName).toBe(newLastName);

    // Verify user data was updated in database
    const updatedUser = await TestHelpers.findUser(mongoConnection, userData.email);
    expect(updatedUser.firstName).toBe(newFirstName);
    expect(updatedUser.lastName).toBe(newLastName);
  });

  it("should return 400 if new user signs in without firstName", async () => {
    // Generate test user data without firstName
    const userData = TestDataGenerator.generateUserData();
    delete userData.firstName;
    await TestHelpers.createUser(mongoConnection, userData);

    // Request OTP and get user
    await axios.post("https://iam.fbi.com/authenticate/request-otp", { email: userData.email });
    const user = await TestHelpers.findUser(mongoConnection, userData.email);
    const otpDoc = await TestHelpers.findOtp(mongoConnection, user._id);

    // Try to sign in without firstName
    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: userData.email,
      otp: otpDoc.code
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.data.message).toBe("First name and last name is required for new user");
  });

  it("should return 400 if user does not exist", async () => {
    const nonExistingEmail = TestDataGenerator.generateUniqueEmail();
    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: nonExistingEmail,
      otp: "123456"
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.data.message).toBe("Email must be identified before sign in");
  });

  it("should return 422 if OTP is invalid", async () => {
    // Generate test user data
    const userData = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(mongoConnection, userData);

    await axios.post("https://iam.fbi.com/authenticate/request-otp", { email: userData.email });
    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: userData.email,
      otp: "000000"
    });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.otp).toBe("OTP is invalid or expired.");
  });

  it("should return 422 if OTP is expired", async () => {
    // Generate test user data
    const userData = TestDataGenerator.generateUserData();
    const user = await TestHelpers.createUser(mongoConnection, userData);

    // Create expired OTP
    const expiredOtpData = TestDataGenerator.generateExpiredOtpData(user.insertedId);
    await TestHelpers.createOtp(mongoConnection, expiredOtpData);

    const response = await axios.post("https://iam.fbi.com/authenticate/sign-in", {
      email: userData.email,
      otp: expiredOtpData.code
    });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.otp).toBe("OTP is invalid or expired.");
  });
});
