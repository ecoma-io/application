import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MaildevClient } from './maildev-client';

describe('MaildevClient', () => {
  let mock: MockAdapter;
  let client: MaildevClient;
  const baseUrl = 'http://localhost:1080';

  beforeEach(() => {
    mock = new MockAdapter(axios);
    client = new MaildevClient(baseUrl);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('getEmail', () => {
    const testAddress = 'test@example.com';
    const mockEmail = {
      id: '123',
      from: [{ address: 'sender@example.com', name: 'Sender' }],
      to: [{ address: testAddress, name: 'Test User' }],
      date: '2024-03-20',
      time: '10:00:00',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
      text: 'Test Text',
    };

    it('should return empty array when no emails found', async () => {
      mock.onGet(`${baseUrl}/email?headers.to=${testAddress}`).reply(200, []);

      const result = await client.getEmail(testAddress);
      expect(result).toEqual([]);
    });

    it('should return emails and delete the first one', async () => {
      mock.onGet(`${baseUrl}/email?headers.to=${testAddress}`).reply(200, [mockEmail]);
      mock.onDelete(`${baseUrl}/email/${mockEmail.id}`).reply(200);

      const result = await client.getEmail(testAddress);
      expect(result).toEqual([mockEmail]);
      expect(mock.history.delete.length).toBe(1);
      expect(mock.history.delete[0].url).toBe(`${baseUrl}/email/${mockEmail.id}`);
    });

    it('should handle delete failure gracefully', async () => {
      mock.onGet(`${baseUrl}/email?headers.to=${testAddress}`).reply(200, [mockEmail]);
      mock.onDelete(`${baseUrl}/email/${mockEmail.id}`).reply(500);

      const result = await client.getEmail(testAddress);
      expect(result).toEqual([mockEmail]);
    });

    it('should handle API error', async () => {
      mock.onGet(`${baseUrl}/email?headers.to=${testAddress}`).reply(500);

      await expect(client.getEmail(testAddress)).rejects.toThrow();
    });
  });
});
