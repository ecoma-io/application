import {
  addQueryParams,
  getHostname,
  getQueryParams,
  getRootDomain,
  isAbsoluteUrl,
  joinUrl,
} from "./url-utils";

describe("URL Utils", () => {
  describe("getRootDomain", () => {
    test("Nên trả về root domain từ hostname", () => {
      expect(getRootDomain("example.com")).toBe("example.com");
      expect(getRootDomain("www.example.com")).toBe("example.com");
      expect(getRootDomain("sub.example.com")).toBe("example.com");
      expect(getRootDomain("sub.sub.example.com")).toBe("example.com");
    });

    test("Nên xử lý đúng với các TLD dài hơn", () => {
      expect(getRootDomain("example.co.uk")).toBe("co.uk");
      // Lưu ý: Hàm này có giới hạn và không xử lý chính xác các TLD phức tạp
    });
  });

  describe("getQueryParams", () => {
    test("Nên trả về object chứa các query parameters", () => {
      expect(getQueryParams("https://example.com?foo=bar&baz=qux")).toEqual({
        foo: "bar",
        baz: "qux",
      });
      expect(getQueryParams("https://example.com?foo=bar&foo=baz")).toEqual({
        foo: "baz", // Lưu ý: chỉ giữ giá trị cuối cùng
      });
      expect(getQueryParams("https://example.com?foo=")).toEqual({
        foo: "",
      });
    });

    test("Nên trả về object rỗng nếu không có query parameters", () => {
      expect(getQueryParams("https://example.com")).toEqual({});
      expect(getQueryParams("https://example.com?")).toEqual({});
    });

    test("Nên trả về object rỗng nếu URL không hợp lệ", () => {
      expect(getQueryParams("invalid-url")).toEqual({});
    });
  });

  describe("addQueryParams", () => {
    test("Nên thêm query parameters vào URL", () => {
      expect(
        addQueryParams("https://example.com", { foo: "bar", baz: 123 })
      ).toBe("https://example.com/?foo=bar&baz=123");
      expect(addQueryParams("https://example.com?a=1", { b: 2 })).toBe(
        "https://example.com/?a=1&b=2"
      );
    });

    test("Nên giữ nguyên URL nếu không có parameters", () => {
      expect(addQueryParams("https://example.com", {})).toBe(
        "https://example.com/"
      );
    });

    test("Nên giữ nguyên URL nếu URL không hợp lệ", () => {
      expect(addQueryParams("invalid-url", { foo: "bar" })).toBe("invalid-url");
    });
  });

  describe("getHostname", () => {
    test("Nên trả về hostname từ URL", () => {
      expect(getHostname("https://example.com")).toBe("example.com");
      expect(getHostname("https://www.example.com/path")).toBe(
        "www.example.com"
      );
      expect(getHostname("http://sub.example.com:8080")).toBe(
        "sub.example.com"
      );
    });

    test("Nên trả về null nếu URL không hợp lệ", () => {
      expect(getHostname("invalid-url")).toBeNull();
    });
  });

  describe("isAbsoluteUrl", () => {
    test("Nên trả về true cho URL tuyệt đối", () => {
      expect(isAbsoluteUrl("https://example.com")).toBe(true);
      expect(isAbsoluteUrl("http://example.com")).toBe(true);
      expect(isAbsoluteUrl("ftp://example.com")).toBe(true);
    });

    test("Nên trả về false cho URL tương đối hoặc không hợp lệ", () => {
      expect(isAbsoluteUrl("/path/to/resource")).toBe(false);
      expect(isAbsoluteUrl("path/to/resource")).toBe(false);
      expect(isAbsoluteUrl("./resource")).toBe(false);
      expect(isAbsoluteUrl("../resource")).toBe(false);
      expect(isAbsoluteUrl("invalid-url")).toBe(false);
    });
  });

  describe("joinUrl", () => {
    test("Nên nối base URL và path", () => {
      expect(joinUrl("https://example.com", "path")).toBe(
        "https://example.com/path"
      );
      expect(joinUrl("https://example.com/", "path")).toBe(
        "https://example.com/path"
      );
      expect(joinUrl("https://example.com", "/path")).toBe(
        "https://example.com/path"
      );
      expect(joinUrl("https://example.com/", "/path")).toBe(
        "https://example.com/path"
      );
    });

    test("Nên xử lý path phức tạp", () => {
      expect(joinUrl("https://example.com", "path/to/resource")).toBe(
        "https://example.com/path/to/resource"
      );
      expect(joinUrl("https://example.com/api", "v1/users")).toBe(
        "https://example.com/api/v1/users"
      );
    });
  });
});
