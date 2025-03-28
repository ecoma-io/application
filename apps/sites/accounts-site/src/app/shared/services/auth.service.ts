import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoggerService } from "@ecoma/nge-logging";
import { WA_LOCATION } from "@ng-web-apis/common";
import { Observable, catchError, map, of, tap } from "rxjs";

export interface KratosFlowResponse {
  state: string;
  ui: {
    nodes?: Array<{
      attributes?: {
        name?: string;
        value?: string;
      };
    }>;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private kratosUrl;
  private logger: LoggerService;

  constructor(
    private http: HttpClient,
    private route: Router,
    loggerService: LoggerService,
    @Inject(WA_LOCATION) private location: Location
  ) {
    this.logger = loggerService.create(AuthService.name);
    this.kratosUrl = `https://${this.location.host.replace(
      "accounts",
      "kratos"
    )}`;
  }

  isAuthenticated(): Observable<boolean> {
    return this.getSession().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getSession(): Observable<unknown> {
    return this.http.get(`${this.kratosUrl}/sessions/whoami`, {
      withCredentials: true,
    });
  }

  createSignUpFlow() {
    // this.location.href = `${this.kratosUrl}/self-service/registration/browser`;
  }

  getSignUpCsrfToken(flowId: string): Observable<string> {
    this.logger.debug(`Getting sign-up csrf token for flow id ${flowId}`);

    return this.http
      .get<KratosFlowResponse>(
        `${this.kratosUrl}/self-service/registration/flows?id=${flowId}`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          if (!response.ui?.nodes) {
            this.logger.fatal("UI nodes not found in response");
            throw Error("UI nodes not found in response");
          }
          const csrfNode = response.ui.nodes.find(
            (node) => node.attributes?.name === "csrf_token"
          );

          if (
            csrfNode?.attributes?.value &&
            typeof csrfNode?.attributes?.value === "string" &&
            csrfNode?.attributes?.value !== ""
          ) {
            this.logger.debug(`Found CSRF token: ${csrfNode.attributes.value}`);
            return csrfNode.attributes.value;
          } else {
            this.logger.fatal("Can't get CSRF token from response");
            throw Error(
              "Can't get CSRF token from response. Attribute value is missing"
            );
          }
        })
      );
  }

  submitSignUpByEmail(
    flowId: string,
    data: {
      csrf_token: string;
      email: string;
      first_name: string;
      last_name: string;
      password: string;
    }
  ): Observable<unknown> {
    const body = {
      csrf_token: data.csrf_token,
      "traits.email": data.email,
      "traits.first_name": data.first_name,
      "traits.last_name": data.last_name,
      password: data.password,
      method: "password", // Bắt buộc phải có
    };

    const url = `${this.kratosUrl}/self-service/registration?flow=${flowId}`;

    return this.http.post(url, body, { withCredentials: true });
  }

  getVerifyCsrfTokenAndCode(
    flowId: string
  ): Observable<{ code: string; csrfToken: string }> {
    this.logger.debug(`Getting sign-up csrf token for flow id ${flowId}`);

    return this.http
      .get<KratosFlowResponse>(
        `${this.kratosUrl}/self-service/verification/flows?id=${flowId}`,
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.state === "passed_challenge") {
            this.route.navigate(["/"]);
          }
        }),
        map((response) => {
          if (!response.ui?.nodes) {
            this.logger.fatal("UI nodes not found in response");
            throw Error("UI nodes not found in response");
          }

          let csrfToken, code;

          const csrfNode = response.ui.nodes.find(
            (node) => node.attributes?.name === "csrf_token"
          );
          if (
            csrfNode?.attributes?.value &&
            typeof csrfNode?.attributes?.value === "string" &&
            csrfNode?.attributes?.value !== ""
          ) {
            this.logger.debug(`Found CSRF token: ${csrfNode.attributes.value}`);
            csrfToken = csrfNode.attributes.value;
          } else {
            this.logger.fatal("Can't get CSRF token from response");
            throw Error(
              "Can't get CSRF token from response. Attribute value is missing"
            );
          }

          const codeNode = response.ui.nodes.find(
            (node) => node.attributes?.name === "code"
          );
          if (
            codeNode?.attributes?.value &&
            typeof codeNode?.attributes?.value === "string" &&
            codeNode?.attributes?.value !== ""
          ) {
            this.logger.debug(`Found Code: ${codeNode.attributes.value}`);
            code = codeNode.attributes.value;
          } else {
            this.logger.fatal("Can't get CSRF token from response");
            throw Error(
              "Can't get CSRF token from response. Attribute value is missing"
            );
          }

          return { code, csrfToken };
        })
      );
  }

  submitVerifyByCode(
    flowId: string,
    data: {
      csrf_token: string;
      code: string;
    }
  ): Observable<KratosFlowResponse> {
    const body = {
      csrf_token: data.csrf_token,
      code: data.code,
      method: "code",
    };
    const url = `${this.kratosUrl}/self-service/verification?flow=${flowId}`;
    return this.http.post<KratosFlowResponse>(url, body, {
      withCredentials: true,
    });
  }

  createSignInFlow() {
    // this.location.href = `${this.kratosUrl}/self-service/login/browser`;
  }

  getSignInCsrfToken(flowId: string): Observable<string> {
    this.logger.debug(`Getting sign-in csrf token for flow id ${flowId}`);

    return this.http
      .get<KratosFlowResponse>(
        `${this.kratosUrl}/self-service/login/flows?id=${flowId}`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          if (!response.ui?.nodes) {
            this.logger.fatal("UI nodes not found in response");
            throw Error("UI nodes not found in response");
          }
          const csrfNode = response.ui.nodes.find(
            (node) => node.attributes?.name === "csrf_token"
          );

          if (
            csrfNode?.attributes?.value &&
            typeof csrfNode?.attributes?.value === "string" &&
            csrfNode?.attributes?.value !== ""
          ) {
            this.logger.debug(`Found CSRF token: ${csrfNode.attributes.value}`);
            return csrfNode.attributes.value;
          } else {
            this.logger.fatal("Can't get CSRF token from response");
            throw Error(
              "Can't get CSRF token from response. Attribute value is missing"
            );
          }
        })
      );
  }

  submitSignInByEmail(
    flowId: string,
    data: {
      csrf_token: string;
      email: string;
      password: string;
    }
  ): Observable<unknown> {
    const body = {
      csrf_token: data.csrf_token,
      identifier: data.email,
      password: data.password,
      method: "password",
    };

    const url = `${this.kratosUrl}/self-service/login?flow=${flowId}`;

    return this.http.post(url, body, { withCredentials: true });
  }
}
