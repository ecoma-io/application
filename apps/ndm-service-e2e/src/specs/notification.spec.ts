import mongoose from 'mongoose';
import * as amqp from 'amqplib';
import { MaildevClient } from '@ecoma/test-utils';
import { pollUntil } from '@ecoma/common';

let mongoConnection: mongoose.Connection;
let rabbitMqConnection: amqp.ChannelModel;
let rabbitMqChannel: amqp.Channel;
let maildevClient: MaildevClient;

beforeAll(async () => {
  // Setup MongoDB connection
  mongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'], { dbName: 'ndm' }).asPromise();

  // Setup RabbitMQ connection
  rabbitMqConnection = await amqp.connect(process.env['RABBITMQ_URI']);
  rabbitMqChannel = await rabbitMqConnection.createChannel();

  // Setup exchange
  await rabbitMqChannel.assertExchange('notification', 'topic', { durable: true });
  await rabbitMqChannel.assertQueue('otp-email', { durable: true });

  maildevClient = new MaildevClient(`https://mail.fbi.com`);
});

afterAll(async () => {
  if (rabbitMqChannel) await rabbitMqChannel.close();
  if (rabbitMqConnection) await rabbitMqConnection.close();
  if (mongoConnection) await mongoConnection.close();
});


describe('Notification Feature', () => {
  it('should send OTP email successfully', async () => {
    // Arrange
    const otpMessage = {
      email: Date.now() + '@example.com',
      firstName: 'Test User',
      otp: '123456',
      expireMinutes: 5
    };

    // Act
    await rabbitMqChannel.publish(
      'notification',
      'otp',
      Buffer.from(JSON.stringify(otpMessage))
    );

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail(otpMessage.email);
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
    expect(email.to[0].address).toBe(otpMessage.email);
    expect(email.html).toContain(otpMessage.otp);
    expect(email.html).toContain(otpMessage.firstName);
  });
});
