import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * Cấu hình chính của ứng dụng Angular.
 * Bao gồm:
 * - Cấu hình phát hiện thay đổi (change detection)
 * - Cấu hình định tuyến
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};
