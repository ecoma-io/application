import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

/**
 * Component gốc của ứng dụng accounts-site.
 * Cung cấp điểm khởi đầu cho toàn bộ ứng dụng và quản lý định tuyến.
 */
@Component({
  imports: [RouterModule],
  selector: "app-root",
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  /** Tiêu đề của ứng dụng */
  title = "accounts-site";
}
