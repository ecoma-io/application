import { Routes } from '@angular/router';


export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'identification',
    pathMatch: 'full',
  },
  {
    path: 'identification',
    loadComponent: () => import('./identification/identification.component').then((m) => m.IdentificationComponent),
  },
  {
    path: 'initialization',
    loadComponent: () => import('./initialization/initialization.component').then((m) => m.InitializationComponent),
  },
  {
    path: 'verification',
    loadComponent: () => import('./verification/verification.component').then((m) => m.VerificationComponent),
  },

];
