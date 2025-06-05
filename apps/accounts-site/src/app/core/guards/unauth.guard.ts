import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const unAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const urlParams = new URLSearchParams(router.url.split('?')[1]);
  const continueUrl = urlParams.get('continue');
  if (continueUrl) {
    window.location.href = continueUrl;
    return;
  } else {
    return router.parseUrl('/dashboard/profile');
  }
};
