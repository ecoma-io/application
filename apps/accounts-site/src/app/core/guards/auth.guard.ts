import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { Domains } from '@ecoma/angular';


/**
 * Auth Guard - Bảo vệ các route yêu cầu xác thực
 *
 * Guard này sẽ kiểm tra xem người dùng đã đăng nhập hay chưa:
 * - Nếu đã đăng nhập: cho phép truy cập route
 * - Nếu chưa đăng nhập: chuyển hướng đến trang đăng nhập với tham số continue để quay lại trang hiện tại sau khi đăng nhập
 *
 * @returns {boolean | UrlTree} - Trả về true nếu đã đăng nhập, hoặc UrlTree để chuyển hướng đến trang đăng nhập
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticateService,
    private router: Router,
    private domains: Domains
  ) {}

  canActivate(): MaybeAsync<GuardResult> {
    // Kiểm tra trạng thái đăng nhập
    if (this.authService.isAuthenticated()) {
      return true;
    }


    // Chuyển hướng đến trang đăng nhập với URL hiện tại làm tham số continue
    return this.router.parseUrl(`/authenticate/identification?continue=${encodeURIComponent(this.domains.getAccountsSiteBaseUrl() + location.pathname)}`);
  }
}
