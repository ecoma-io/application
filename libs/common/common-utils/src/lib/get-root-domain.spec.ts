import { getRootDomain } from "./get-root-domain";

describe("getRootDomain", () => {
  it("should return the last two parts of the domain", () => {
    expect(getRootDomain("www.example.com")).toBe("example.com");
    expect(getRootDomain("subdomain.example.com")).toBe("example.com");
    expect(getRootDomain("a.b.c.d.e.f.example.com")).toBe("example.com");
  });

  it("should return the domain for a single-level domain", () => {
    expect(getRootDomain("example.com")).toBe("example.com");
  });

  it("should handle domain with no subdomains", () => {
    expect(getRootDomain("localhost")).toBe("localhost");
  });

  it("should handle domain with more than 2 parts", () => {
    expect(getRootDomain("a.b.c.d.e.f.example.com")).toBe("example.com");
  });
});
