import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID, ValueProvider } from "@angular/core";
import { Request } from 'express';

/**
 * Injection token for providing the Express Request object in server-side environment
 */
export const REQUEST_TOKEN: InjectionToken<Request> = new InjectionToken<Request>('REQUEST_TOKEN');

/**
 * Provides environment configuration for the Domains service
 * @param request - The Express Request object to be used in server-side environment
 * @returns Environment providers configuration
 */
export const provideSsrCookie = (request: Request): ValueProvider => {
  return {
    provide: REQUEST_TOKEN,
    useValue: request,
  };
};


@Injectable({ providedIn: "root" })
export class Cookies {
  private readonly documentIsAccessible: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(REQUEST_TOKEN) private request: Request
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  /**
   * Tạo biểu thức chính quy để tìm kiếm cookie
   *
   * @param name Tên cookie cần tìm
   * @returns Biểu thức chính quy để tìm cookie
   */
  static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
    return new RegExp(
      `(?:^${escapedName}|;\\s*${escapedName})=(.*?)(?:;|$)`,
      "g"
    );
  }

  /**
   * Giải mã một thành phần được mã hóa của URI một cách an toàn
   *
   * @param encodedURIComponent Giá trị đã được mã hóa URI
   * @returns Giá trị đã được giải mã URI. Nếu không thể giải mã, trả về giá trị gốc
   */
  static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // URI component is not properly encoded, returning as is
      return encodedURIComponent;
    }
  }

  /**
   * Kiểm tra xem cookie có tồn tại hay không
   *
   * @param name Tên cookie cần kiểm tra
   * @returns true nếu cookie tồn tại, false nếu không
   */
  check(name: string): boolean {
    name = encodeURIComponent(name);
    const cookie = this.documentIsAccessible
      ? this.document.cookie
      : this.request?.headers?.cookie;
    if (!cookie) {
      return false;
    }
    const regExp: RegExp = Cookies.getCookieRegExp(name);
    return regExp.test(cookie);
  }

  /**
   * Lấy giá trị của cookie theo tên
   *
   * @param name Tên cookie cần lấy
   * @returns Giá trị của cookie. Trả về chuỗi rỗng nếu không tìm thấy
   */
  get(name: string): string {
    name = encodeURIComponent(name);

    const cookie = this.documentIsAccessible
      ? this.document.cookie
      : this.request?.headers?.cookie;
    if (!cookie) {
      return "";
    } else {
      const regExp: RegExp = Cookies.getCookieRegExp(name);
      const result: RegExpExecArray | null = regExp.exec(cookie);
      return result && result[1]
        ? Cookies.safeDecodeURIComponent(result[1])
        : "";
    }
  }

  /**
   * Lấy tất cả cookie dưới dạng đối tượng JSON
   *
   * @returns Đối tượng chứa tất cả cookie với key là tên cookie và value là giá trị cookie
   */
  getAll() {
    const cookies: { [key: string]: string } = {};
    const cookieString: string | undefined = this.documentIsAccessible
      ? this.document?.cookie
      : this.request?.headers?.cookie;

    if (cookieString && cookieString !== "") {
      cookieString.split(";").forEach((currentCookie) => {
        const [cookieName, cookieValue] = currentCookie.split("=");
        cookies[Cookies.safeDecodeURIComponent(cookieName.replace(/^ /, ""))] =
          Cookies.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  /**
   * Thiết lập cookie với các tham số được cung cấp
   *
   * Các tham số cookie:
   * <pre>
   * expires  Số ngày cho đến khi cookie hết hạn hoặc một đối tượng Date
   * path     Đường dẫn cookie
   * domain   Tên miền cookie
   * secure   Cờ bảo mật cookie
   * sameSite Token OWASP same site 'Lax', 'None', hoặc 'Strict'. Mặc định là 'Lax'
   * partitioned Cờ phân vùng cookie
   * </pre>
   *
   * @param name     Tên cookie
   * @param value    Giá trị cookie
   * @param options  Đối tượng chứa các tham số cookie
   */
  set(
    name: string,
    value: string,
    options?: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "Lax" | "None" | "Strict";
      partitioned?: boolean;
    }
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }

    let cookieString: string =
      encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";";
    options = options ?? {};

    if (options.expires) {
      if (typeof options.expires === "number") {
        const dateExpires: Date = new Date(
          new Date().getTime() + options.expires * 1000 * 60 * 60 * 24
        );
        cookieString += "expires=" + dateExpires.toUTCString() + ";";
      } else {
        cookieString += "expires=" + options.expires.toUTCString() + ";";
      }
    }

    if (options.path) {
      cookieString += "path=" + options.path + ";";
    }

    if (options.domain) {
      cookieString += "domain=" + options.domain + ";";
    }

    if (options.secure === false && options.sameSite === "None") {
      // forced with secure flag because sameSite=None
      options.secure = true;
    }
    if (options.secure) {
      cookieString += "secure;";
    }

    if (!options.sameSite) {
      options.sameSite = "Lax";
    }

    cookieString += "sameSite=" + options.sameSite + ";";

    if (options.partitioned) {
      cookieString += "Partitioned;";
    }

    this.document.cookie = cookieString;
  }

  /**
   * Xóa cookie theo tên
   *
   * @param name     Tên cookie cần xóa
   * @param path     Đường dẫn cookie
   * @param domain   Tên miền cookie
   * @param secure   Cờ bảo mật cookie
   * @param sameSite Cờ SameSite cookie - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   */
  delete(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: "Lax" | "None" | "Strict" = "Lax"
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }
    this.set(name, "", {
      expires: new Date("Thu, 01 Jan 1970 00:00:01 GMT"),
      path,
      domain,
      secure,
      sameSite,
    });
  }

  /**
   * Xóa tất cả cookie
   *
   * @param path     Đường dẫn cookie
   * @param domain   Tên miền cookie
   * @param secure   Cờ bảo mật cookie
   * @param sameSite Cờ SameSite cookie
   */
  deleteAll(
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: "Lax" | "None" | "Strict" = "Lax"
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }
    const cookies = this.getAll();
    for (const cookieName in cookies) {
      if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }
}
