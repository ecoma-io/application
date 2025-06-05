import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Redirector } from '@ecoma/nge-redirect';
import { AuthService } from '../services/auth.service';

export const unAuthGuard = () => {
  const authService = inject(AuthService);
  const redirector = inject(Redirector);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const urlParams = new URLSearchParams(router.url.split('?')[1]);
  const continueUrl = urlParams.get('continue');
  if (continueUrl) {
    return redirector.redirect(continueUrl);
  } else {
    return router.parseUrl('/dashboard/profile');
  }
};
