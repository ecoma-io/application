import mongoose from 'mongoose';
import * as amqp from 'amqplib';

let mongoConnection: mongoose.Connection;
let rabbitMqConnection: amqp.ChannelModel;
let rabbitMqChannel: amqp.Channel;

beforeAll(async () => {
  // Setup MongoDB connection
  mongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'], { dbName: 'ndm' }).asPromise();

  // Setup RabbitMQ connection
  rabbitMqConnection = await amqp.connect(process.env['RABBITMQ_URI']);
  rabbitMqChannel = await rabbitMqConnection.createChannel();

});

afterAll(async () => {
  if (rabbitMqChannel) await rabbitMqChannel.close();
  if (rabbitMqConnection) await rabbitMqConnection.close();
  if (mongoConnection) await mongoConnection.close();
});


describe('Template Feature', () => {
  it('should seed email template successfully', async () => {
    // Assert
    const emailTemplate = await mongoConnection.db.collection('notification_templates').findOne({ name: 'email' });
    expect(emailTemplate).toBeDefined();
    expect(emailTemplate.name).toBe('email');
    expect(emailTemplate.description).toBe('Common layout for all emails');
    expect(emailTemplate.placeholders).toEqual(['body', 'subject', 'email', 'firstName', 'lastName']);
    expect(emailTemplate.html).toContain('{{body}}');
    expect(emailTemplate.html).toContain('{{subject}}');
    expect(emailTemplate.text).toContain('{{body}}');
  });

  it('should seed OTP email template successfully', async () => {
    // Assert
    const otpTemplate = await mongoConnection.db.collection('notification_templates').findOne({ name: 'otp-email' });
    expect(otpTemplate).toBeDefined();
    expect(otpTemplate.name).toBe('otp-email');
    expect(otpTemplate.description).toBe('OTP email template');
    expect(otpTemplate.placeholders).toEqual(['firstName', 'otp', 'expireMinutes', 'subject', 'email', 'firstName', 'lastName']);
    expect(otpTemplate.html).toContain('{{firstName}}');
    expect(otpTemplate.html).toContain('{{otp}}');
    expect(otpTemplate.html).toContain('{{expireMinutes}}');
    expect(otpTemplate.html).toContain('{{firstName}}');
  });


});
