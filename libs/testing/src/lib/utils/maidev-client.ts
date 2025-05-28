import axios from "axios";
import * as https from "https";

export interface IMailAddress {
  address: string;
  name: string;
}

export interface IMail {
  id: string;
  from: IMailAddress[];
  to: IMailAddress[];
  date: string;
  time: string;
  subject: string;
  html: string;
  text: string;
}

const agent = new https.Agent({
  rejectUnauthorized: false, // Bỏ qua kiểm tra SSL
});

export class MaildevClient {
  constructor(private baseApiUrl: string) {}

  async getEmail(address: string, timeout = 10000): Promise<IMail> {
    const endTime = Date.now() + timeout;

    // Lặp lại kiểm tra email cho đến khi tìm thấy hoặc timeout
    while (Date.now() < endTime) {
      try {
        const response = await axios.get(
          `${this.baseApiUrl}/email?headers.to=${address}`,
          { httpsAgent: agent }
        );
        const emails = response.data as IMail[];

        if (emails.length > 0) {
          // Xóa email vừa lấy được đi
          try {
            await axios.delete(`${this.baseApiUrl}/email/${emails[0].id}`, {
              httpsAgent: agent,
            });
          } catch {
            // Không xử lý gì nếu không thể xóa
          }

          return emails[0]; // Trả về email đầu tiên tìm thấy
        }
      } catch (err) {
        const error = err as Error;
        throw new Error(
          `Failed to fetch emails for ${address}: ${error.message}`
        );
      }

      // Nếu không tìm thấy email, chờ một chút rồi thử lại
      await new Promise((resolve) => setTimeout(resolve, 500)); // Sleep 500ms before retry
    }

    // Nếu hết thời gian mà không tìm thấy email, throw lỗi timeout
    throw new Error(`Timeout waiting for email for ${address}`);
  }
}
