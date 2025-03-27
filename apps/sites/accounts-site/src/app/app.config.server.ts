import { ApplicationConfig, mergeApplicationConfig } from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";

import { appConfig } from "./app.config";

/** Cấu hình riêng cho phía server */
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

/** Cấu hình cuối cùng cho server, kết hợp từ cấu hình chung và cấu hình server */
export const config = mergeApplicationConfig(appConfig, serverConfig);
