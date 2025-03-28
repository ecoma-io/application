import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideLogging } from "@ecoma/nge-logging";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideLogging(),
  ],
};
