import { Routes } from '@angular/router';
import { unAuthGuard } from './core/guards/unauth.guard';
import { authGuard } from './core/guards/auth.guard';
import { authRoutes } from './features/authenticate/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/profile', pathMatch: 'full' },
  {
    path: 'authenticate',
    canMatch: [unAuthGuard],
    loadComponent: () => import('./features/authenticate/auth.component').then((m) => m.AuthComponent),
    children: authRoutes
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        children: dashboardRoutes
      },
    ],
  },
];
