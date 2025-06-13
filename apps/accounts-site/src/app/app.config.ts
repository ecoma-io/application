import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideSidebarNavItems } from '@ecoma/angular';
import { appNavItems } from './app.nav-items';

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
    provideSidebarNavItems(appNavItems),
  ],
};
