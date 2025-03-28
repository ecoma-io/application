import { beforeEach, describe, it } from "@jest/globals";
import { SpyInstance } from "jest-mock";
import { EventTestingHelper, MockFactory } from "../test-helpers";

/**
 * Service mẫu phát event
 */
class OrderService {
  private eventPublisher: any;

  constructor(eventPublisher: any) {
    this.eventPublisher = eventPublisher;
  }

  async createOrder(orderId: string, items: string[]): Promise<void> {
    // Logic tạo đơn hàng...

    // Phát event
    await this.eventPublisher.publish("order.created", {
      orderId,
      items,
      createdAt: new Date(),
    });
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    // Logic hủy đơn hàng...

    // Phát event
    await this.eventPublisher.publish("order.cancelled", {
      orderId,
      reason,
      cancelledAt: new Date(),
    });
  }

  async processOrder(orderId: string): Promise<void> {
    // Logic xử lý đơn hàng...

    // Phát nhiều event theo thứ tự
    await this.eventPublisher.publish("order.processing", {
      orderId,
      status: "processing",
    });

    // Giả lập xử lý

    await this.eventPublisher.publish("order.shipped", {
      orderId,
      status: "shipped",
    });
  }
}

/**
 * Ví dụ test sử dụng EventTestingHelper
 * Lưu ý: Test này chỉ là ví dụ, không chạy thực tế trong CI
 */
describe("Event Testing Helper Examples", () => {
  let eventPublisher: any;
  let publishSpy: SpyInstance;
  let orderService: OrderService;

  beforeEach(() => {
    // Tạo mock cho event publisher
    eventPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    // Tạo spy cho phương thức publish
    publishSpy = MockFactory.createSpy(eventPublisher, "publish");

    // Khởi tạo service với mock event publisher
    orderService = new OrderService(eventPublisher);
  });

  it("nên phát event order.created khi tạo đơn hàng", async () => {
    // Arrange
    const orderId = "123";
    const items = ["item1", "item2"];

    // Act
    await orderService.createOrder(orderId, items);

    // Assert
    EventTestingHelper.expectEventPublished(publishSpy, "order.created", {
      orderId,
      items,
    });
  });

  it("nên phát event order.cancelled khi hủy đơn hàng", async () => {
    // Arrange
    const orderId = "123";
    const reason = "out of stock";

    // Act
    await orderService.cancelOrder(orderId, reason);

    // Assert
    EventTestingHelper.expectEventPublished(publishSpy, "order.cancelled", {
      orderId,
      reason,
    });
  });

  it("nên phát đúng số lần event khi xử lý đơn hàng", async () => {
    // Arrange
    const orderId = "123";

    // Act
    await orderService.processOrder(orderId);

    // Assert
    EventTestingHelper.expectEventPublishedTimes(
      publishSpy,
      "order.processing",
      1
    );
    EventTestingHelper.expectEventPublishedTimes(
      publishSpy,
      "order.shipped",
      1
    );
  });

  it("nên phát các event theo đúng thứ tự khi xử lý đơn hàng", async () => {
    // Arrange
    const orderId = "123";

    // Act
    await orderService.processOrder(orderId);

    // Assert
    EventTestingHelper.expectEventsPublishedInOrder(publishSpy, [
      ["order.processing", { orderId, status: "processing" }],
      ["order.shipped", { orderId, status: "shipped" }],
    ]);
  });
});
