import { INestApplication, ModuleMetadata } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

/**
 * Helper hỗ trợ kiểm thử API NestJS.
 * @since 1.1.0
 */
export class ApiTestingHelper {
  /**
   * Tạo một testing module NestJS
   * @param metadata - Metadata của module cần test
   * @returns Testing module
   */
  static async createTestingModule(
    metadata: ModuleMetadata
  ): Promise<TestingModule> {
    return Test.createTestingModule(metadata).compile();
  }

  /**
   * Tạo một ứng dụng NestJS từ testing module
   * @param module - Testing module đã được compile
   * @returns NestJS application
   */
  static async createApp(module: TestingModule): Promise<INestApplication> {
    const app = module.createNestApplication();
    await app.init();
    return app;
  }

  /**
   * Tạo một request agent cho supertest từ ứng dụng NestJS
   * @param app - Ứng dụng NestJS
   * @returns Supertest request agent
   */
  static createRequestAgent(app: INestApplication): ReturnType<typeof request> {
    return request(app.getHttpServer());
  }

  /**
   * Tạo một request agent cho supertest từ metadata module
   * @param metadata - Metadata của module cần test
   * @returns Supertest request agent và ứng dụng NestJS
   */
  static async createTestClient(metadata: ModuleMetadata): Promise<{
    requestAgent: ReturnType<typeof request>;
    app: INestApplication;
  }> {
    const module = await this.createTestingModule(metadata);
    const app = await this.createApp(module);
    const requestAgent = this.createRequestAgent(app);
    return { requestAgent, app };
  }

  /**
   * Đóng ứng dụng NestJS
   * @param app - Ứng dụng NestJS
   */
  static async closeApp(app: INestApplication): Promise<void> {
    if (app) {
      await app.close();
    }
  }
}
