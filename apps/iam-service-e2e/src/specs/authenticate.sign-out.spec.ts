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

describe('Authenticate Sign Out Feature', () => {
  it('should sign out successfully with valid session token', async () => {
    // Create test user
    const userData = TestDataGenerator.generateUserData();
    const user = await TestHelpers.createUser(mongoConnection, userData);

    // Create test session
    const sessionData = TestDataGenerator.generateSessionData(user.insertedId);
    await TestHelpers.createSession(mongoConnection, sessionData);

    // Sign out with the token
    const response = await axios.post(
      'https://iam.fbi.com/authenticate/sign-out',
      {},
      {
        headers: {
          Cookie: `TOKEN=${sessionData.token}`,
        },
        withCredentials: true,
      }
    );

    expect(response.status).toBe(HttpStatus.OK);

    // Verify session was deleted
    const deletedSession = await TestHelpers.findSession(mongoConnection, sessionData.token);
    expect(deletedSession).toBeNull();
  });

  it('should return 401 if no session token provided', async () => {
    const response = await axios.post('https://iam.fbi.com/authenticate/sign-out', {}, { withCredentials: true });
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.data.message).toBe('No session token found');
  });

  it('should return 401 if invalid session token provided', async () => {
    const response = await axios.post(
      'https://iam.fbi.com/authenticate/sign-out',
      {},
      {
        headers: {
          Cookie: `TOKEN=invalid-token`,
        },
        withCredentials: true,
      }
    );
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
