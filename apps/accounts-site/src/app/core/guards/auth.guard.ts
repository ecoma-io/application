import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Domains } from '@ecoma/nge-domain';

/**
 * Auth Guard - Bảo vệ các route yêu cầu xác thực
 *
 * Guard này sẽ kiểm tra xem người dùng đã đăng nhập hay chưa:
 * - Nếu đã đăng nhập: cho phép truy cập route
 * - Nếu chưa đăng nhập: chuyển hướng đến trang đăng nhập với tham số continue để quay lại trang hiện tại sau khi đăng nhập
 *
 * @returns {boolean | UrlTree} - Trả về true nếu đã đăng nhập, hoặc UrlTree để chuyển hướng đến trang đăng nhập
 */
export const authGuard = () => {
  // Inject các service cần thiết
  const authService = inject(AuthService);
  const router = inject(Router);
  const domains = inject(Domains);

  // Kiểm tra trạng thái đăng nhập
  if (authService.isAuthenticated()) {
    return true;
  }

  // Chuyển hướng đến trang đăng nhập với URL hiện tại làm tham số continue
  return router.parseUrl(`/authenticate/identification?continue=${encodeURIComponent(domains.getAccountsSiteBaseUrl() + location.pathname)}`);
};
