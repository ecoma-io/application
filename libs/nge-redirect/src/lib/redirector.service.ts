import { EnvironmentProviders, Inject, Injectable, InjectionToken, makeEnvironmentProviders, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Response } from 'express'; // Import Response từ express (chỉ cho type checking)

export const RESPONSE_TOKEN = new InjectionToken<Request>('RESPONSE_TOKEN');

export const provideSsrRedirector = (response: Response): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: RESPONSE_TOKEN,
      useValue: response,
    },
  ]);
};

@Injectable({ providedIn: 'root' })
export class Redirector {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE_TOKEN) private response: Response // Tiêm RESPONSE
  ) {}

  redirect(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      // Nếu đang chạy trên trình duyệt (client-side), sử dụng window.location.href
      window.location.href = url;
    } else {
      // Nếu đang chạy trên server (SSR), sử dụng expressResponse
      if (this.response) {
        this.response.redirect(302, url); // 302 Found (temporary redirect)
        this.response.end(); // Kết thúc phản hồi để ngăn Angular tiếp tục render
      }
    }
  }
}
