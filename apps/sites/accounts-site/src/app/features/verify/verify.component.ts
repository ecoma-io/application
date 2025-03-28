import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoggerService } from "@ecoma/nge-logging";
import {
  ErrorModalService,
  FormFieldErrorComponent,
  IconComponent,
  MessageableValidators,
  ModalService,
} from "@ecoma/nge-ui";
import { AuthService } from "../../shared/services/auth.service";
import { VerifySuccessModalComponent } from "./verify-sucess-modal.component";

@Component({
  selector: "app-verify",
  imports: [
    CommonModule,
    IconComponent,
    ReactiveFormsModule,
    FormFieldErrorComponent,
  ],
  templateUrl: "./verify.component.html",
  styleUrl: "./verify.component.scss",
})
export class VerifyComponent implements OnInit {
  private readonly logger: LoggerService;

  private readonly codeValidators: ValidatorFn[] = [
    MessageableValidators.required(),
    MessageableValidators.fixedLength(6),
  ];

  private flowInfo?: { id: string; csrfToken: string; code: string };
  protected codeForm!: FormGroup;
  protected isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private errorModalService: ErrorModalService,
    private modalService: ModalService,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.create(VerifyComponent.name);
    this.codeForm = this.fb.group({
      code: ["", this.codeValidators],
    });
  }

  async ngOnInit(): Promise<void> {
    this.logger.debug("ngOnInit called");
    const flowId = this.route.snapshot.queryParamMap.get("flow");
    const code = this.route.snapshot.queryParamMap.get("code");
    this.codeForm.get("code")?.setValue(code);
    if (!flowId) {
      this.logger.error(
        "Flow id query parrams not found. Create new sign-up follow"
      );
    } else {
      this.getFlowInfo(flowId);
    }
  }

  getFlowInfo(flowId: string) {
    // this.authService.getVerifyCsrfTokenAndCode(flowId).subscribe({
    //   next: ({ csrfToken, code }) => {
    //     this.logger.debug(`Csrf token: ${csrfToken}`);
    //     this.logger.debug(`Verify code: ${code}`);
    //     this.flowInfo = { id: flowId, csrfToken };
    //     this.onSubmitCode();
    //   },
    //   error: (err) => {
    //     this.onGetFlowInfoError(flowId, err);
    //   },
    // });
  }

  onSubmitCode() {
    if (this.flowInfo) {
      this.authService
        .submitVerifyByCode(this.flowInfo.id, {
          csrf_token: this.flowInfo.csrfToken,
          code: this.flowInfo.code,
        })
        .subscribe({
          next: (response) => {
            if (response.state === "passed_challenge") {
              this.modalService
                .open(VerifySuccessModalComponent)
                .subscribe(() => {
                  this.router.navigate(["/"]);
                });
            }
          },
          error: (err) => {
            this.errorModalService.handleGenericError(err);
          },
        });
    }
  }

  private isFlowExpiredError(err: unknown) {
    return err instanceof HttpErrorResponse && err.status === 410;
  }

  private onGetFlowInfoError(flowId: string, err: unknown) {
    if (this.isFlowExpiredError(err)) {
      this.logger.info("The flow is expired!");
    } else {
      this.errorModalService.handleGenericError(err, () =>
        this.getFlowInfo(flowId)
      );
    }
  }
}
