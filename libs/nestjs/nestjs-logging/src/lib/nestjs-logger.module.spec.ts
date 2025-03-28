import { Test } from "@nestjs/testing";
import { NestjsLogger } from "./nestjs-logger";
import { NestjsLoggerModule } from "./nestjs-logger.module";

describe("NestjsLoggerModule", () => {
  describe("register()", () => {
    it("nên tạo module mà không cần tùy chọn", async () => {
      const module = await Test.createTestingModule({
        imports: [NestjsLoggerModule.register()],
      }).compile();

      const logger = module.get<NestjsLogger>(NestjsLogger);
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(NestjsLogger);
    });

    it("nên truyền defaultContext vào logger", async () => {
      const module = await Test.createTestingModule({
        imports: [NestjsLoggerModule.register({ defaultContext: "TestApp" })],
      }).compile();

      const logger = module.get<NestjsLogger>(NestjsLogger);
      expect(logger).toBeDefined();
      expect(logger["context"]).toBe("TestApp");
    });

    it("nên tạo module global khi isGlobal=true", async () => {
      const dynamicModule = NestjsLoggerModule.register({ isGlobal: true });
      expect(dynamicModule.global).toBe(true);
    });

    it("nên không phải là global module khi isGlobal=false", async () => {
      const dynamicModule = NestjsLoggerModule.register({ isGlobal: false });
      expect(dynamicModule.global).toBe(false);
    });

    it("nên không phải là global module theo mặc định", async () => {
      const dynamicModule = NestjsLoggerModule.register();
      expect(dynamicModule.global).toBe(false);
    });
  });
});
