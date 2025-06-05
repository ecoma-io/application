import { Routes } from '@angular/router';
import { unAuthGuard } from './core/guards/unauth.guard';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canMatch: [unAuthGuard],
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'verify',
        loadComponent: () => import('./features/auth/otp-verification/otp-verification.component').then((m) => m.OtpVerificationComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            loadComponent: () => import('./features/dashboard/profile/profile.component').then((m) => m.ProfileComponent),
          },
          {
            path: 'sessions',
            loadComponent: () => import('./features/dashboard/sessions/sessions.component').then((m) => m.SessionsComponent),
          },
          {
            path: 'settings',
            loadComponent: () => import('./features/dashboard/settings/settings.component').then((m) => m.SettingsComponent),
          },
        ],
      },
    ],
  },
];
