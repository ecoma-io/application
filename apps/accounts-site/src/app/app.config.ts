import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideSvgInject } from '@ecoma/nge-svg-injector';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

/**
 * Cấu hình chính của ứng dụng Angular.
 * Bao gồm:
 * - Cấu hình phát hiện thay đổi (change detection)
 * - Cấu hình định tuyến
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay(),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideSvgInject(),
  ],
};
