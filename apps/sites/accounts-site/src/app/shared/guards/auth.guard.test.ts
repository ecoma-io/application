import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { isObservable, of } from "rxjs";
import { AuthService } from "../services/auth.service";
import { authGuard } from "./auth.guard";

jest.mock("@angular/core", () => ({
  ...jest.requireActual("@angular/core"),
  inject: jest.fn(),
}));

describe("authGuard", () => {
  let authServiceMock: jest.Mocked<AuthService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;
  let originalLocation: string;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn(),
      createSignInFlow: jest.fn(),
    } as any;

    (jest.mocked(inject) as jest.Mock).mockImplementation(
      () => authServiceMock
    );

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    originalLocation = window.location.href;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: originalLocation },
    });
  });

  it("should allow activation if user is authenticated", (done) => {
    authServiceMock.isAuthenticated.mockReturnValue(of(true));

    const result = authGuard(mockRoute, mockState);

    if (isObservable(result)) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        expect(window.location.href).toBe("");
        done();
      });
    } else {
      expect(result).toBe(true);
      expect(window.location.href).toBe("");
      done();
    }
  });

  it("should redirect to login if user is not authenticated", (done) => {
    authServiceMock.isAuthenticated.mockReturnValue(of(false));

    const result = authGuard(mockRoute, mockState);

    if (isObservable(result)) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(authServiceMock.createSignInFlow).toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBe(false);
      expect(authServiceMock.createSignInFlow).toHaveBeenCalled();
      done();
    }
  });
});
