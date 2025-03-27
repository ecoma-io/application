import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { ContainerTestContext } from "../test-helpers/test-context";
import {
  MongoDBContainer,
  PostgresContainer,
  StartedMongoDBContainer,
  StartedPostgresContainer,
} from "../testing-containers";

/**
 * Ví dụ test sử dụng các test container
 * Lưu ý: Test này chỉ là ví dụ, không chạy thực tế trong CI
 */
describe("Test Container Examples", () => {
  describe("Sử dụng PostgresContainer riêng lẻ", () => {
    let container: PostgresContainer;
    let postgresUrl: string;

    beforeAll(async () => {
      // Khởi tạo container
      container = new PostgresContainer();
      const startedContainer = await container.start();
      postgresUrl = startedContainer.getConnectionString();

      // Ở đây bạn có thể kết nối đến PostgreSQL bằng TypeORM hoặc client khác
    }, 60000);

    afterAll(async () => {
      // Dừng container sau khi test xong
      if (container) {
        await container.stop();
      }
    });

    it("nên tạo được connection string PostgreSQL hợp lệ", () => {
      expect(postgresUrl).toMatch(/^postgresql:\/\/test:test@.+:\d+\/test$/);
    });
  });

  describe("Sử dụng MongoDBContainer riêng lẻ", () => {
    let container: MongoDBContainer;
    let mongoUrl: string;

    beforeAll(async () => {
      // Khởi tạo container
      container = new MongoDBContainer();
      const startedContainer = await container.start();
      mongoUrl = startedContainer.getConnectionString();

      // Ở đây bạn có thể kết nối đến MongoDB bằng Mongoose hoặc client khác
    }, 60000);

    afterAll(async () => {
      // Dừng container sau khi test xong
      if (container) {
        await container.stop();
      }
    });

    it("nên tạo được connection string MongoDB hợp lệ", () => {
      expect(mongoUrl).toMatch(/^mongodb:\/\/.+:\d+\?directConnection=true$/);
    });
  });

  describe("Sử dụng ContainerTestContext để quản lý nhiều container", () => {
    const testContext = new ContainerTestContext();
    let postgresUrl: string;
    let mongoUrl: string;

    beforeAll(async () => {
      // Thêm các container vào context
      const postgresContainer = new PostgresContainer();
      const mongodbContainer = new MongoDBContainer();

      testContext.addContainer(postgresContainer);
      testContext.addContainer(mongodbContainer);

      // Khởi động tất cả các container
      await testContext.setup();

      // Lấy các container đã khởi động
      const startedPostgres =
        testContext.getStartedContainer<StartedPostgresContainer>(0);
      const startedMongo =
        testContext.getStartedContainer<StartedMongoDBContainer>(1);

      postgresUrl = startedPostgres.getConnectionString();
      mongoUrl = startedMongo.getConnectionString();
    }, 120000);

    afterAll(async () => {
      // Dừng tất cả các container
      await testContext.teardown();
    });

    it("nên tạo được connection string PostgreSQL và MongoDB hợp lệ", () => {
      expect(postgresUrl).toMatch(/^postgresql:\/\/test:test@.+:\d+\/test$/);
      expect(mongoUrl).toMatch(/^mongodb:\/\/.+:\d+\?directConnection=true$/);
    });
  });
});
