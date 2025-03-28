import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { LoggerService } from "@ecoma/nge-logging";
import {
  ErrorModalComponent,
  ErrorModalData,
  ErrorModalService,
  FormFieldErrorComponent,
  IconComponent,
  MessageableValidators,
  ModalService,
} from "@ecoma/nge-ui";
import { AuthService } from "../../shared/services/auth.service";
import { SignUpComponent } from "../sign-up/sign-up.component";

@Component({
  selector: "app-sign-in",
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormFieldErrorComponent,
    IconComponent,
  ],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.scss",
})
export class SignInComponent implements OnInit {
  private readonly emailValidators: ValidatorFn[] = [
    MessageableValidators.required(),
    MessageableValidators.email(),
  ];

  private readonly passwordValidators: ValidatorFn[] = [
    MessageableValidators.required(),
    MessageableValidators.minLength(8),
  ];

  protected signInForm!: FormGroup;
  protected isSubmitting = false;
  private flowInfo?: { id: string; csrfToken: string };
  private logger: LoggerService;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService,
    private errorModalService: ErrorModalService,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.create(SignUpComponent.name);
    this.signInForm = this.fb.group({
      email: ["", this.emailValidators],
      password: ["", this.passwordValidators],
    });
  }

  async ngOnInit(): Promise<void> {
    this.logger.debug("ngOnInit called");
    const flowId = this.route.snapshot.queryParamMap.get("flow");
    if (!flowId) {
      this.logger.debug(
        "Flow id query parrams not found. Create new sign-up follow"
      );
      this.authService.createSignInFlow();
    } else {
      this.getFlowInfo(flowId);
    }
  }

  private getFlowInfo(flowId: string) {
    this.logger.debug(`In sign up flow id:  ${flowId}`);
    this.authService.getSignInCsrfToken(flowId).subscribe({
      next: (csrfToken) => {
        this.logger.debug(`Csrf token: ${csrfToken}`);
        this.flowInfo = { id: flowId, csrfToken };
      },
      error: (err) => {
        this.onGetFlowInfoError(err);
      },
    });
  }
  protected submitSignInByEmailForm(): void {
    this.signInForm.markAllAsTouched();
    if (this.signInForm.invalid || !this.flowInfo) {
      return;
    } else {
      this.isSubmitting = true;
      this.authService
        .submitSignInByEmail(this.flowInfo.id, {
          csrf_token: this.flowInfo.csrfToken,
          ...this.signInForm.value,
        })
        .subscribe({
          next: () => {
            this.logger.info("Sign in successed");
            this.router.navigate(["/"]);
            this.isSubmitting = false;
          },
          error: (err) => {
            this.isSubmitting = false;
            this.onSubmitSignUpByEmailFormError(err);
          },
        });
    }
  }

  private onSubmitSignUpByEmailFormError(err: unknown) {
    this.errorModalService.handleGenericError(
      err,
      this.submitSignInByEmailForm
    );
  }

  private onGetFlowInfoError(err: unknown) {
    if (this.isFlowExpiredError(err)) {
      this.logger.info("The flow is expired!");
      this.displayFlowExpiredErrorModal();
    } else {
      this.errorModalService.handleGenericError(err, () =>
        this.authService.createSignInFlow()
      );
    }
  }

  private isFlowExpiredError(err: unknown) {
    return err instanceof HttpErrorResponse && err.status === 410;
  }

  private displayFlowExpiredErrorModal() {
    this.modalService
      .open<ErrorModalData, boolean>(ErrorModalComponent, {
        icon: "duotone/reply-clock.svg",
        title: "Session Expired",
        autoRetryAfter: 3,
        message:
          "The current session has expired. A new session will be automatically created in 3 seconds.",
        primaryAction: {
          id: "create-now",
          classes: "btn-primary",
          label: "Refresh now",
          countdown: true,
        },
      })
      .subscribe(() => {
        this.authService.createSignUpFlow();
      });
  }
}
