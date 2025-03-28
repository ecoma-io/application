import { Route } from "@angular/router";
import { authGuard } from "./shared/guards/auth.guard";
import { guestGuard } from "./shared/guards/guest.guard";

export const appRoutes: Route[] = [
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./shared/components/main-layout/main-layout.component").then(
        (c) => c.MainLayoutComponent
      ),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/home/home.component").then((c) => c.HomeComponent),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./features/profile/profile.component").then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: "sessions",
        loadComponent: () =>
          import("./features/sessions/sessions.component").then(
            (c) => c.SessionsComponent
          ),
      },
    ],
  },
  {
    path: "",
    canActivate: [guestGuard],
    children: [
      {
        path: "sign-in",
        loadComponent: () =>
          import("./features/sign-in/sign-in.component").then(
            (c) => c.SignInComponent
          ),
      },
      {
        path: "sign-up",
        loadComponent: () =>
          import("./features/sign-up/sign-up.component").then(
            (c) => c.SignUpComponent
          ),
      },
      {
        path: "verify",
        loadComponent: () =>
          import("./features/verify/verify.component").then(
            (c) => c.VerifyComponent
          ),
      },
      {
        path: "recovery",
        loadComponent: () =>
          import("./features/recovery/recovery.component").then(
            (c) => c.RecoveryComponent
          ),
      },
      {
        path: "recovery/confirm",
        loadComponent: () =>
          import(
            "./features/recovery/recovery-confirm/recovery-confirm.component"
          ).then((c) => c.RecoveryConfirmComponent),
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./features/not-found-error/not-found-error.component").then(
        (c) => c.NotFoundErrorComponent
      ),
  },
];
