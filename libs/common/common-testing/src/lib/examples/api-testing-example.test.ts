import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Controller, Get, INestApplication } from "@nestjs/common";
import request from "supertest";
import { ApiTestingHelper } from "../test-helpers/api-testing-helper";

/**
 * Controller mẫu cho ví dụ test
 */
@Controller("test")
class TestController {
  @Get()
  getHello(): { message: string } {
    return { message: "Hello World" };
  }

  @Get("items")
  getItems(): { items: string[] } {
    return { items: ["item1", "item2", "item3"] };
  }
}

/**
 * Ví dụ test sử dụng ApiTestingHelper
 * Lưu ý: Test này chỉ là ví dụ, không chạy thực tế trong CI
 */
describe("API Testing Helper Examples", () => {
  let app: INestApplication;
  let agent: ReturnType<typeof request>;

  beforeAll(async () => {
    // Tạo testing module và app
    const module = await ApiTestingHelper.createTestingModule({
      imports: [],
      controllers: [TestController],
    });

    app = await ApiTestingHelper.createApp(module);
    agent = ApiTestingHelper.createRequestAgent(app);
  });

  afterAll(async () => {
    // Đóng app sau khi test xong
    await ApiTestingHelper.closeApp(app);
  });

  it("nên trả về Hello World khi gọi GET /test", async () => {
    const response = await agent.get("/test").expect(200);
    expect(response.body).toEqual({ message: "Hello World" });
  });

  it("nên trả về danh sách items khi gọi GET /test/items", async () => {
    const response = await agent.get("/test/items").expect(200);
    expect(response.body).toEqual({ items: ["item1", "item2", "item3"] });
  });

  describe("Sử dụng createTestClient", () => {
    let testApp: INestApplication;
    let testAgent: ReturnType<typeof request>;

    beforeAll(async () => {
      // Sử dụng helper để tạo test client trong một bước
      const result = await ApiTestingHelper.createTestClient({
        imports: [],
        controllers: [TestController],
      });

      testApp = result.app;
      testAgent = result.requestAgent;
    });

    afterAll(async () => {
      await ApiTestingHelper.closeApp(testApp);
    });

    it("nên trả về Hello World khi gọi GET /test", async () => {
      const response = await testAgent.get("/test").expect(200);
      expect(response.body).toEqual({ message: "Hello World" });
    });
  });
});
