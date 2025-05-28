import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent, appConfig } from "./app";

/**
 * Hàm khởi tạo ứng dụng trên server.
 * Sử dụng cấu hình server để khởi chạy ứng dụng trong môi trường SSR.
 */
const bootstrap = () => bootstrapApplication(AppComponent, appConfig);

export default bootstrap;
