import axios from 'axios';
import * as https from 'https';

/**
 * Interface representing an email address with name
 */
export interface IMailAddress {
  /** Email address */
  address: string;
  /** Display name */
  name: string;
}

/**
 * Interface representing an email message
 */
export interface IMail {
  /** Unique identifier of the email */
  id: string;
  /** Array of sender addresses */
  from: IMailAddress[];
  /** Array of recipient addresses */
  to: IMailAddress[];
  /** Date the email was sent */
  date: string;
  /** Time the email was sent */
  time: string;
  /** Email subject line */
  subject: string;
  /** HTML content of the email */
  html: string;
  /** Plain text content of the email */
  text: string;
}

/**
 * HTTPS agent that allows self-signed certificates
 */
const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Client for interacting with Maildev API
 */
export class MaildevClient {
  /**
   * Creates a new MaildevClient instance
   * @param baseApiUrl - Base URL of the Maildev API
   */
  constructor(private baseApiUrl: string) {}

  /**
   * Retrieves emails sent to a specific address and deletes the first one found
   * @param address - Email address to search for
   * @returns Promise resolving to an array of matching emails
   */
  async getEmail(address: string): Promise<IMail[]> {
    const response = await axios.get(`${this.baseApiUrl}/email?headers.to=${address}`, { httpsAgent: agent });
    const emails = response.data as IMail[];

    if (emails.length > 0) {
      // Delete the first email found
      try {
        await axios.delete(`${this.baseApiUrl}/email/${emails[0].id}`, {
          httpsAgent: agent,
        });
      } catch {
        // Ignore deletion errors
      }

      return emails; // Return the first email found
    } else {
      return [];
    }
  }
}
