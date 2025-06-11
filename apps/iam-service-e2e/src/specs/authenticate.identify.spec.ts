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

describe('Authenticate Identify Feature', () => {
  it('should get identify successfully', async () => {
    const nonExistingEmail = TestDataGenerator.generateUniqueEmail();
    const response = await axios.post('https://iam.fbi.com/authenticate/identify', { email: nonExistingEmail });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.data).toBeDefined();
    expect(response.data.data).toBeDefined();
    expect(response.data.data).toStrictEqual({});
  });

  it('should get identify successfully with existing user', async () => {
    const userData = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(mongoConnection, userData);

    const response = await axios.post('https://iam.fbi.com/authenticate/identify', { email: userData.email });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.data).toBeDefined();
    expect(response.data.data).toBeDefined();
    expect(response.data.data.firstName).toBe(userData.firstName);
  });

  it('should return 400 for input with extra fields', async () => {
    const userData = TestDataGenerator.generateUserData();
    const response = await axios.post('https://iam.fbi.com/authenticate/identify', {
      email: userData.email,
      extraField: 'some data'
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.data.message).toBeDefined();
    expect(response.data.message).toBe('The request data is malformed');
  });

  it('should return 422 for missing email', async () => {
    const response = await axios.post('https://iam.fbi.com/authenticate/identify', {});

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.email).toBe('email should not be empty');
  });

  it('should return 422 for invalid email format', async () => {
    const response = await axios.post('https://iam.fbi.com/authenticate/identify', { email: 'invalid-email-format' });

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.data.details.email).toBe('email should be in valid standard email format');
  });
});
