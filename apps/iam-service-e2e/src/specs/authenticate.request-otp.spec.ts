import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import mongoose from 'mongoose';
import * as amqp from 'amqplib';
import { TestHelpers } from '../support/test-helpers';
import { TestDataGenerator } from '../support/test-data-generator';
import { MaildevClient } from '@ecoma/test-utils';
import { pollUntil } from '@ecoma/common';

let mongoConnection: mongoose.Connection;
let rabbitMqConnection: amqp.ChannelModel;
let rabbitMqChannel: amqp.Channel;
let maildevClient: MaildevClient;

beforeAll(async () => {
  // Setup MongoDB connection
  mongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'], { dbName: 'iam' }).asPromise();

  // Setup RabbitMQ connection
  rabbitMqConnection = await amqp.connect(process.env['RABBITMQ_URI']);
  rabbitMqChannel = await rabbitMqConnection.createChannel();

  // Setup maildev client
  maildevClient = new MaildevClient(`https://mail.fbi.com`);

  // Setup Axios with proper configuration
  axios.defaults.validateStatus = () => true; // Allow all status codes
});

afterAll(async () => {
  if (rabbitMqChannel) await rabbitMqChannel.close();
  if (rabbitMqConnection) await rabbitMqConnection.close();
  if (mongoConnection) await mongoConnection.close();
});

describe('Authenticate Request OTP Feature', () => {
  it('should request OTP successfully', async () => {
    const userData = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(mongoConnection, userData);

    const response = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.data).toBeDefined();

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail(userData.email);
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
  }, 20000);

  it('should request OTP successfully by manipulating database timestamp', async () => {
    const userData = TestDataGenerator.generateUserData();
    const user = await TestHelpers.createUser(mongoConnection, userData);

    // First request (should succeed)
    const firstResponse = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(firstResponse.status).toBe(HttpStatus.CREATED);

    // Update OTP timestamp
    const twoMinutesAgo = new Date(Date.now() - 120 * 1000);
    await TestHelpers.updateOtpCreatedAt(mongoConnection, user.insertedId, twoMinutesAgo);

    // Second request (should succeed immediately)
    const secondResponse = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(secondResponse.status).toBe(HttpStatus.CREATED);
  });

  it('should return error when requesting OTP too fast', async () => {
    const userData = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(mongoConnection, userData);

    // First request (should succeed)
    const firstResponse = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(firstResponse.status).toBe(HttpStatus.CREATED);

    // Second request (should fail with rate limit)
    const secondResponse = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(secondResponse.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(secondResponse.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');

    // Third request (should still fail with rate limit)
    const thirdResponse = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: userData.email });
    expect(thirdResponse.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(thirdResponse.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');
  });

  it('should return 400 for input with extra fields', async () => {
    const userData = TestDataGenerator.generateUserData();
    const response = await axios.post('https://iam.fbi.com/authenticate/request-otp', {
      email: userData.email,
      extraField: 'some data'
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.data.message).toBeDefined();
    expect(response.data.message).toBe('The request data is malformed');
  });

  it('should return 422 for missing email', async () => {
    const response = await axios.post('https://iam.fbi.com/authenticate/request-otp', {});

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.email).toBe('email should not be empty');
  });

  it('should return 422 for invalid email format', async () => {
    const response = await axios.post('https://iam.fbi.com/authenticate/request-otp', { email: 'invalid-email-format' });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.email).toBe('email should be in valid standard email format');
  });
});
