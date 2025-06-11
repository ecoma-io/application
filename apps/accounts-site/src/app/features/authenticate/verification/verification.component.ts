import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { FormError, MessageableValidators, SvgInjector, Domains } from '@ecoma/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgInjector, RouterLink, FormError],
  host: {
    class: 'space-y-12',
  },
  template: `
    <!-- Header -->
    <div class="text-center space-y-2">
      <div class="avatar placeholder">
        <div class="bg-primary/10 text-primary rounded-full w-24">
        <nge-svg-injector [path]="iconUrl('/brands/ecoma.svg')" class="p-4" />
        </div>
      </div>
      <h2 class="text-2xl font-bold" data-test-id="verification-title">Identity verification</h2>
      <p class="text-base-content/70" data-test-id="verification-intro">
        Hi {{ firstName }}{{ lastName?' '+lastName:''}}! please confirm it is you
      </p>
      <a routerLink="/authenticate/identification" class="flex justify-center text-primary" data-test-id="verification-email-link">
        {{email}}
      </a>
    </div>

    <form [formGroup]="otpForm" (ngSubmit)="onSubmit()" class="space-y-6" data-test-id="verification-form">
      <div class="alert alert-error" *ngIf="errorMessage" data-test-id="verification-main-error">
        <nge-svg-injector [path]="iconUrl('/duotone/exclamation.svg')" class="shrink-0 w-6 h-6"> </nge-svg-injector>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="flex flex-col justify-center items-center" >
        <input
          formControlName="otp"
          type="number"
          inputmode="numeric"
          autocomplete="one-time-code"
          placeholder="OTP Code"
          class="input input-bordered w-full max-w-64 text-center text-xl font-bold p-0"
          data-test-id="verification-otp-input"
        />
        <nge-form-error [control]="otpForm.get('otp')" data-test-id="verification-otp-error"/>
      </div>

      <div class="flex flex-col items-center space-y-4">
        <button type="submit" class="btn btn-accent w-full" #verifyButton [disabled]="!otpForm.valid || isLoading" data-test-id="verification-verify-button">
          <span class="loading loading-spinner" *ngIf="isLoading" data-test-id="verification-verify-spinner"></span>
          {{ isLoading ? 'Verifying...' : 'Verify Code' }}
        </button>
        <button type="button" class="btn btn-link btn-sm px-2 normal-case" [disabled]="!canResend" (click)="requestOTP()" data-test-id="verification-resend-button">
            <nge-svg-injector
              [path]="iconUrl('/duotone/arrow-down-to-square.svg')"
              class="w-4 h-4 fill-primary/50"
              [class.animate-spin]="isResending"
            >
            </nge-svg-injector>
            Get OTP <span *ngIf="resendTimer > 0" data-test-id="verification-resend-timer">({{ resendTimer }}s)</span>
        </button>
      </div>

    </form>
  `,
})
export class VerificationComponent implements OnInit, OnDestroy {

  readonly GET_OTP_COLD_DOWN_SECONDS = 10;

  iconsBaseUrl: string;
  otpForm: FormGroup;
  isLoading = false;
  isResending = false;
  resendTimer = 0;
  canResend = true;
  errorMessage = '';
  email = '';
  firstName = '';
  lastName?: string;


  private timerInterval: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private domain: Domains,
    private title: Title
  ) {
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();
    this.otpForm = this.fb.group({
      otp: ['', [MessageableValidators.required("Please enter OTP code"), MessageableValidators.pattern(/^[0-9]{6}$/, 'Please enter valid OTP code')]],
    });
  }

  ngOnInit() {
    this.title.setTitle('Identity verification');
    const currentUserEmail = sessionStorage.getItem('current-user-email');
    if (!currentUserEmail) {
      this.router.navigate(['/authenticate/identification']);
      return;
    } else {
      this.email = currentUserEmail;
    }

    const currentUserFirstName = sessionStorage.getItem('current-user-first-name');
    if (!currentUserFirstName) {
      this.router.navigate(['/authenticate/initialization']);
      return;
    } else {
      this.firstName = currentUserFirstName;
    }

    const currentUserLastName = sessionStorage.getItem('current-user-last-name');
    if (currentUserLastName) {
      this.lastName = currentUserLastName;
    }
  }

  startResendTimer() {
    this.resendTimer = this.GET_OTP_COLD_DOWN_SECONDS;
    this.canResend = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  requestOTP() {
    if (this.canResend) {
      this.isResending = true;
      this.startResendTimer();

      this.authService.requestOTP({ email: this.email }).subscribe({
        next: () => {
          this.isResending = false;
          this.otpForm.get('otp')?.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.isResending = false;
          this.isLoading = false;
          this.errorMessage = error.error?.message;
          if (error.error?.details) {
            for (const field of Object.keys(error.error?.details)) {
              this.otpForm.get(field)?.setErrors({
                server: {
                  message: error.error?.details[field]
                }
              })
            }
            this.otpForm.updateValueAndValidity();
          }
        },
      });
    }
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const otp = this.otpForm.get('otp')?.value + '';
      const payload = {
        email: this.email,
        otp,
        firstName: this.firstName,
        lastName: this.lastName
      }
      this.authService.signIn(payload).subscribe({
        next: () => {
          sessionStorage.removeItem('current-user-email');
          sessionStorage.removeItem('current-user-first-name');
          sessionStorage.removeItem('current-user-last-name');

          const continueUrl = this.activatedRoute.snapshot.queryParams['continue'];
          if (continueUrl) {
            window.location.href = continueUrl;
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message;
          if (error.error?.details) {
            for (const field of Object.keys(error.error?.details)) {
              this.otpForm.get(field)?.setErrors({
                server: {
                  message: error.error?.details[field]
                }
              })
            }
            this.otpForm.updateValueAndValidity();
          }
        },
      });
    }
  }

  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
