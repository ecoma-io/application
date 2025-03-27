import { expect } from "@jest/globals";
import { SpyInstance } from "jest-mock";

/**
 * Helper hỗ trợ kiểm thử event/message.
 * @since 1.1.0
 */
export class EventTestingHelper {
  /**
   * Kiểm tra xem một event có được publish với payload đúng không
   * @param publishSpy - Jest spy function trên phương thức publish
   * @param eventType - Loại event cần kiểm tra
   * @param expectedPayload - Payload mong đợi (một phần hoặc toàn bộ)
   */
  static expectEventPublished(
    publishSpy: SpyInstance,
    eventType: string,
    expectedPayload?: Record<string, unknown>
  ): void {
    expect(publishSpy).toHaveBeenCalled();

    const publishCalls = publishSpy.mock.calls;
    const eventPublished = publishCalls.some((call: any[]) => {
      const [topic, payload] = call;
      if (topic !== eventType) return false;

      if (expectedPayload) {
        return Object.entries(expectedPayload).every(
          ([key, value]) =>
            JSON.stringify(payload[key]) === JSON.stringify(value)
        );
      }

      return true;
    });

    expect(eventPublished).toBe(true);
  }

  /**
   * Kiểm tra xem một event có được publish đúng số lần không
   * @param publishSpy - Jest spy function trên phương thức publish
   * @param eventType - Loại event cần kiểm tra
   * @param times - Số lần mong đợi (mặc định là ít nhất 1)
   */
  static expectEventPublishedTimes(
    publishSpy: SpyInstance,
    eventType: string,
    times = 1
  ): void {
    const publishCount = publishSpy.mock.calls.filter(
      (call: any[]) => call[0] === eventType
    ).length;
    expect(publishCount).toBe(times);
  }

  /**
   * Kiểm tra xem một event có được publish với payload đúng thứ tự không
   * @param publishSpy - Jest spy function trên phương thức publish
   * @param events - Mảng các event cần kiểm tra theo thứ tự [eventType, payload]
   */
  static expectEventsPublishedInOrder(
    publishSpy: SpyInstance,
    events: Array<[string, Record<string, unknown>?]>
  ): void {
    expect(publishSpy).toHaveBeenCalledTimes(events.length);

    events.forEach((event, index) => {
      const [eventType, expectedPayload] = event;
      const [actualEventType, actualPayload] = publishSpy.mock.calls[index] as [
        string,
        Record<string, unknown>
      ];

      expect(actualEventType).toBe(eventType);

      if (expectedPayload) {
        Object.entries(expectedPayload).forEach(([key, value]) => {
          expect((actualPayload as Record<string, unknown>)[key]).toEqual(
            value
          );
        });
      }
    });
  }
}
