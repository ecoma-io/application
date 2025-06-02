import { Redirector } from '@ecoma/nge-redirect';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Domains } from '@ecoma/nge-domain';

export const authGuard = () => {
  const authService = inject(AuthService);
  const domains = inject(Domains);
  const redirector = inject(Redirector);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return redirector.redirect(domains.getAccountsSiteBaseUrl() + '/auth/login?continute=' + router.url);
};
