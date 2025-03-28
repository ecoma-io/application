import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { tap } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated().pipe(
    tap((isAuth) => {
      if (!isAuth) {
        authService.createSignInFlow();
      }
    })
  );
};
