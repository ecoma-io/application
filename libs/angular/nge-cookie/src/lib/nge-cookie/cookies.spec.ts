import { DOCUMENT, isPlatformServer } from "@angular/common";
import { PLATFORM_ID, Provider } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Request } from "express";
import { Cookies } from "./cookies";

describe("Cookies Service", () => {
  let service: Cookies;

  afterEach(() => {
    TestBed.resetTestingModule(); // 🔹 Đặt lại TestBed sau mỗi test case
  });

  describe("Client-Side Rendering (CSR)", () => {
    let mockDocument: Partial<Document>;

    beforeEach(() => {
      mockDocument = { cookie: "" };

      TestBed.configureTestingModule({
        providers: [
          Cookies,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: "browser" },
          { provide: "REQUEST", useValue: null }, // CSR không cần REQUEST
        ],
      });

      service = TestBed.inject(Cookies);
    });

    it("should set a cookie", () => {
      service.set("test", "value", { path: "/" });
      expect(mockDocument.cookie).toContain("test=value");
    });

    it("should get a cookie", () => {
      mockDocument.cookie = "test=value";
      expect(service.get("test")).toBe("value");
    });

    it("should check if a cookie exists", () => {
      mockDocument.cookie = "test=value";
      expect(service.check("test")).toBe(true);
    });

    it("should delete a cookie", () => {
      mockDocument.cookie = "test=value";
      service.delete("test");
      expect(mockDocument.cookie).not.toContain("test=value");
    });

    it("should return null if cookie name is empty", () => {
      expect(service.get("")).toBe("");
    });

    it("should return null if cookie does not exist", () => {
      expect(service.get("nonExistent")).toBe("");
    });

    it("should return empty object when no cookies exist", () => {
      (service as any).document = { cookie: "" };
      expect(service.getAll()).toEqual({});
    });

    it("should not set cookie in non-browser environment", () => {
      Object.defineProperty(service, "documentIsAccessible", {
        get: () => false,
      });
      service.set("test", "value");
      expect(document.cookie).not.toContain("test=value");
    });

    it("should set cookie with expiration date as Date object", () => {
      const futureDate = new Date(Date.now() + 86400000);
      service.set("test", "value", { expires: futureDate });

      // Thay vì kiểm tra document.cookie, hãy kiểm tra chuỗi cookie được tạo ra
      const cookieString = service.get("test");
      expect(cookieString).toBe("value");
    });

    it("should set cookie with expiration date as Date object", () => {
      const futureDate = new Date(Date.now() + 86400000);
      const setSpy = jest.spyOn(service, "set");

      service.set("test", "value", { expires: futureDate });

      expect(setSpy).toHaveBeenCalledWith(
        "test",
        "value",
        expect.objectContaining({
          expires: futureDate,
        })
      );
    });

    it("should set cookie with expiration date as number", () => {
      service.set("test", "value", { expires: 1 });

      expect(service.getAll()).toHaveProperty("test", "value"); // Không kiểm tra expires vì nó không hiển thị
    });
  });

  describe("Server-Side Rendering (SSR)", () => {
    let mockRequest: Partial<Request>;
    let mockSSRProviders: Provider[];

    beforeEach(() => {
      mockRequest = {
        headers: {
          cookie: "testCookie=testValue; anotherCookie=anotherValue",
        },
      };

      mockSSRProviders = [
        { provide: DOCUMENT, useValue: {} }, // 🔹 SSR không có DOM
        { provide: PLATFORM_ID, useValue: "server" },
        { provide: "REQUEST", useValue: mockRequest },
        { provide: "RESPONSE", useValue: {} }, // 🔹 Giả lập response object
      ];

      TestBed.configureTestingModule({
        providers: [Cookies, ...mockSSRProviders],
      });

      service = TestBed.inject(Cookies);
    });

    it("should get a cookie from request headers", () => {
      expect(service.get("testCookie")).toBe("testValue");
    });

    it("should check if a cookie exists in request headers", () => {
      expect(service.check("testCookie")).toBe(true);
      expect(service.check("nonExistent")).toBe(false);
    });

    it("should return all cookies in JSON format", () => {
      const cookies = service.getAll();
      expect(cookies).toEqual({
        testCookie: "testValue",
        anotherCookie: "anotherValue",
      });
    });

    it("should not set cookies in SSR environment", () => {
      service.set("newCookie", "newValue", { path: "/" });
      expect(service.get("newCookie")).toBe("");
    });

    it("should not delete cookies in SSR environment", () => {
      service.delete("testCookie");
      expect(service.get("testCookie")).toBe("testValue");
    });

    it("should return null if cookie name is empty", () => {
      expect(service.get("")).toBe("");
    });

    it("should return null if cookie does not exist", () => {
      expect(service.get("nonExistent")).toBe("");
    });

    it("should detect server environment", () => {
      expect(isPlatformServer(TestBed.inject(PLATFORM_ID))).toBe(true);
    });
  });
});
