import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

/**
 * Cấu hình chính của ứng dụng Angular.
 * Bao gồm:
 * - Cấu hình hydration cho SSR
 * - Cấu hình phát hiện thay đổi (change detection)
 * - Cấu hình định tuyến
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
