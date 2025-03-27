import { pollUntil } from "./polling-utils";

describe("Polling Utils", () => {
  describe("pollUntil", () => {
    test("Nên trả về kết quả khi hàm kiểm tra thành công", async () => {
      let attemptCount = 0;
      const checkFn = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount >= 3) {
          return Promise.resolve("success");
        }
        return Promise.resolve(null);
      });

      jest.spyOn(global, "setTimeout").mockImplementation((cb: () => void) => {
        cb();
        return 0 as unknown as NodeJS.Timeout;
      });

      const result = await pollUntil(checkFn, { maxRetries: 5, delayMs: 100 });

      expect(result).toBe("success");
      expect(checkFn).toHaveBeenCalledTimes(3);
    }, 10000);

    test("Nên trả về undefined khi hàm kiểm tra không thành công sau số lần thử tối đa", async () => {
      const checkFn = jest.fn().mockImplementation(() => {
        return Promise.resolve(null);
      });

      jest.spyOn(global, "setTimeout").mockImplementation((cb: () => void) => {
        cb();
        return 0 as unknown as NodeJS.Timeout;
      });

      const result = await pollUntil(checkFn, { maxRetries: 3, delayMs: 100 });

      expect(result).toBeUndefined();
      expect(checkFn).toHaveBeenCalledTimes(3);
    }, 10000);

    test("Nên sử dụng các giá trị mặc định nếu không cung cấp options", async () => {
      let attemptCount = 0;
      const checkFn = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount >= 5) {
          return Promise.resolve("success");
        }
        return Promise.resolve(null);
      });

      jest.spyOn(global, "setTimeout").mockImplementation((cb: () => void) => {
        cb();
        return 0 as unknown as NodeJS.Timeout;
      });

      const result = await pollUntil(checkFn, { delayMs: 0 });

      expect(result).toBe("success");
      expect(checkFn).toHaveBeenCalledTimes(5);
    }, 10000);

    test("Nên xử lý đúng khi hàm kiểm tra ném lỗi", async () => {
      const error = new Error("Test error");
      const checkFn = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(
        pollUntil(checkFn, { maxRetries: 3, delayMs: 0 })
      ).rejects.toThrow(error);
      expect(checkFn).toHaveBeenCalledTimes(1);
    }, 10000);
  });
});
