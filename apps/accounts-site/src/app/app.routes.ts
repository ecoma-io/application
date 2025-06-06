import { Routes } from '@angular/router';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { authRoutes } from './features/authenticate/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/profile', pathMatch: 'full' },
  {
    path: 'authenticate',
    canActivate : [UnAuthGuard],
    loadComponent: () => import('./features/authenticate/auth.component').then((m) => m.AuthComponent),
    children: authRoutes
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        children: dashboardRoutes
      },
    ],
  },
];
