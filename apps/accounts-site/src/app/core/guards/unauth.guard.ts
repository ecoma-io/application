import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): MaybeAsync<GuardResult> {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    const urlParams = new URLSearchParams(this.router.url.split('?')[1]);
    const continueUrl = urlParams.get('continue');
    if (continueUrl) {
      window.location.href = continueUrl;
      return false;
    } else {
      return this.router.parseUrl('/dashboard/profile');
    }
  }
}
