import { Routes } from '@angular/router';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { authenticateRoutes } from './features/authenticate/authenticate.routes';
import { myAccountsRoutes } from './features/my-account/my-account.routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/my-account', pathMatch: 'full' },
  {
    path: 'authenticate',
    canActivate: [UnAuthGuard],
    loadComponent: () => import('./features/authenticate/authenticate.component').then((m) => m.AuthenticateComponent),
    children: authenticateRoutes,
  },
  {
    path: 'my-account',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/my-account/my-account.component').then((m) => m.MyAccountComponent),
        children: myAccountsRoutes,
      },
    ],
  },
];
