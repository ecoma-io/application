import { Routes } from '@angular/router';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { authenticateRoutes } from './features/authenticate/authenticate.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/profile', pathMatch: 'full' },
  {
    path: 'authenticate',
    canActivate : [UnAuthGuard],
    loadComponent: () => import('./features/authenticate/authenticate.component').then((m) => m.AuthenticateComponent),
    children: authenticateRoutes
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
