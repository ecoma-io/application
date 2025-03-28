import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { isObservable, of } from "rxjs";
import { AuthService } from "../services/auth.service";
import { guestGuard } from "./guest.guard";

jest.mock("@angular/core", () => ({
  ...jest.requireActual("@angular/core"),
  inject: jest.fn(),
}));

describe("guestGuard", () => {
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn(),
    } as any;

    routerMock = {
      navigate: jest.fn(),
    } as any;

    (jest.mocked(inject) as jest.Mock).mockImplementation((token) => {
      if (token === AuthService) return authServiceMock;
      if (token === Router) return routerMock;
      return null;
    });

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
  });

  it("should allow access if user is NOT authenticated", (done) => {
    authServiceMock.isAuthenticated.mockReturnValue(of(false));

    const result = guestGuard(mockRoute, mockState);

    if (isObservable(result)) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(true);
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    }
  });

  it("should redirect to home if user is authenticated", (done) => {
    authServiceMock.isAuthenticated.mockReturnValue(of(true));

    const result = guestGuard(mockRoute, mockState);

    if (isObservable(result)) {
      result.subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
        done();
      });
    } else {
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
      done();
    }
  });
});
