import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { WA_LOCATION } from "@ng-web-apis/common";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockLocation = { host: "accounts.example.com" } as Location;
  const kratosUrl = "https://kratos.example.com";

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: WA_LOCATION, useValue: mockLocation },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should construct kratosUrl correctly", () => {
    expect((service as any).kratosUrl).toBe("https://kratos.example.com");
  });

  it("should call getSession and return session data", () => {
    const mockSession = {
      id: "123",
      identity: { traits: { email: "user@example.com" } },
    };

    service.getSession().subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`${kratosUrl}/sessions/whoami`);
    expect(req.request.method).toBe("GET");
    req.flush(mockSession);
  });

  it("should return true for authenticated user", () => {
    const mockSession = { id: "123" };

    service.isAuthenticated().subscribe((isAuth) => {
      expect(isAuth).toBe(true);
    });

    const req = httpMock.expectOne(`${kratosUrl}/sessions/whoami`);
    req.flush(mockSession);
  });

  it("should return false for unauthenticated user", () => {
    service.isAuthenticated().subscribe((isAuth) => {
      expect(isAuth).toBe(false);
    });

    const req = httpMock.expectOne(`${kratosUrl}/sessions/whoami`);
    req.error(new ErrorEvent("Unauthorized"), { status: 401 });
  });

  it("should return false if getSession fails with a 500 error", () => {
    service.isAuthenticated().subscribe((isAuth) => {
      expect(isAuth).toBe(false);
    });

    const req = httpMock.expectOne(`${kratosUrl}/sessions/whoami`);
    req.error(new ErrorEvent("Internal Server Error"), { status: 500 });
  });
});
