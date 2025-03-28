/* eslint-disable no-empty-pattern */
import { Mail, MaildevClient } from "@ecoma/testing-utils";
import { test as baseTest } from "@playwright/test";
import axios from "axios";
import * as https from "https";

export interface UserInfo {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserData {
  id: string;
}

interface MailBoxFixture {
  mailbox: {
    getEmail: (address: string, timeout?: number) => Promise<Mail>;
  };
  seeder: {
    createUser: (info: UserInfo) => Promise<UserData>;
  };
}

const agent = new https.Agent({
  rejectUnauthorized: false, // Bỏ qua kiểm tra SSL
});

// Tạo fixture trong Playwright
const test = baseTest.extend<MailBoxFixture>({
  mailbox: async ({}, use) => {
    const maildevClient = new MaildevClient("https://mail.fbi.com");

    // Trả về phương thức getEmail để sử dụng trong các bài test
    await use({ getEmail: maildevClient.getEmail });
  },
  seeder: async ({}, use) => {
    const kratosAdminBaseUrl = "https://kratos-admin.fbi.com";

    const createUser = async (info: UserInfo): Promise<UserData> => {
      const payload = {
        schema_id: "default",
        traits: {
          first_name: info.firstName ?? "John",
          last_name: info.lastName ?? "Doe",
          email: info.email,
        },
        state: "active",
        credentials: {
          password: {
            config: {
              password: info.password ?? "StrongPasword123",
            },
          },
        },
        verifiable_addresses: [
          {
            status: "completed",
            value: info.email,
            verified: true,
            via: "email",
          },
        ],
      };

      try {
        const response = await axios.post(
          `${kratosAdminBaseUrl}/admin/identities`,
          payload,
          { httpsAgent: agent }
        );

        if (response.status === 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.data;
        return data as UserData;
      } catch (err) {
        const error = err as Error;
        throw new Error(
          `Failed to create user ${info.email}: ${error.message}`
        );
      }
    };

    // Trả về phương thức getEmail để sử dụng trong các bài test
    await use({ createUser });
  },
});

export { test };
