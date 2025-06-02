import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Domains } from '@ecoma/nge-domain';
import { Redirector } from '@ecoma/nge-redirect';
import { url } from 'inspector';

export const unAuthGuard = () => {
  const authService = inject(AuthService);
  const domains = inject(Domains);
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
    return redirector.redirect(domains.getAccountsSiteBaseUrl() + '/dashboard');
  }
};
