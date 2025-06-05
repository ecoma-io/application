import { SvgInjector } from '@ecoma/nge-svg-injector';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Domains } from '@ecoma/nge-domain';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { AuthIdentifyResponseDTO } from '@ecoma/iam-service-dtos';
import { HttpErrorResponse } from '@angular/common/http';
import { FormError, MessageableValidators } from "@ecoma/nge-form-error";

@Component({
  selector: 'app-identification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgInjector, FormError],
  host: {
    class: 'space-y-12',
  },
  template: `
    <!-- Header -->
    <div class="text-center space-y-3">
      <div class="avatar placeholder mb-4 floating">
        <div class="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary rounded-full w-24">
          <nge-svg-injector path="/icon.svg" class="p-4" />
        </div>
      </div>
      <h1 class="font-semibold text-2xl" data-test-id="identification-page-title">Identity Authentication</h1>
      <p class="text-base-content/70 text-sm">Sign in to your account or create a new one instantly</p>
    </div>



    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">

      <div class="alert alert-error text-sm" *ngIf="errorMessage" data-test-id="identification-main-error-message">
        <nge-svg-injector [path]="iconUrl('/duotone/triangle-exclamation.svg')" class="w-5 h-5"></nge-svg-injector>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="form-control">
        <div class="relative group">
          <nge-svg-injector
            [path]="iconUrl('/duotone/envelope.svg')"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:fill-primary fill-primary/50"
          >
          </nge-svg-injector>
          <input
            type="email"
            formControlName="email"
            placeholder="Enter your email"
            class="input input-bordered w-full pl-10 min-h-12 bg-base-100/50 focus:bg-base-100 transition-all duration-300 border-2"
            data-test-id="identification-email-input"
          />
        </div>
        <nge-form-error data-test-id="identification-email-error" [control]="loginForm.get('email')" />
      </div>

      <div class="space-y-4">
        <button
          type="submit"
          class="btn btn-accent w-full min-h-12 shadow-lg hover:shadow-primary/30 transition-all duration-300"
          [disabled]="!loginForm.valid || isLoading"
          data-test-id="identification-continue-with-email-button">
          <span class="loading loading-spinner" *ngIf="isLoading" data-test-id="identification-continue-with-email-button-spinner"></span>
          <nge-svg-injector
            *ngIf="!isLoading"
            [path]="iconUrl('/duotone/envelope-open-text.svg')"
            class="w-6 h-6 fill-accent-content"
          ></nge-svg-injector>
          {{ isLoading ? 'Sending Code...' : 'Continue with Email' }}
        </button>

        <div class="divider text-base-content/50">OR</div>

        <button
          type="button"
          class="btn bg-base-100 hover:bg-base-200 w-full gap-2 min-h-12 transition-all duration-300 border-2"
          (click)="loginWithGoogle()"
          data-test-id="identification-continue-with-google-button">
          <nge-svg-injector [path]="iconUrl('/duotone/g.svg')" class="w-6 h-6 fill-base-content"></nge-svg-injector>
          Continue with Google
        </button>
      </div>
    </form>

    <!-- Footer -->
    <div class="text-center space-y-2">
      <p class="text-sm text-base-content/70">By continuing, you agree to our</p>
      <div class="flex justify-center gap-2 text-sm">
        <a [href]="termOfServiceHref" class="link link-hover text-primary" data-test-id="identification-terms-of-service-link">Terms of Service</a>
        <span class="text-base-content/50">&</span>
        <a [href]="privacyPolicyHref" class="link link-hover text-primary" data-test-id="identification-privacy-policy-link">Privacy Policy</a>
      </div>
    </div>
  `,
})
export class IdentificationComponent {

  readonly termOfServiceHref = '#';
  readonly privacyPolicyHref = '#';


  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  iconsBaseUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private domain: Domains,
    private title: Title
  ) {

    // Thiết lập tiêu đề cho trang web
    this.title.setTitle('Identity Authentication');

    // Lấy đường dẫn cơ sở cho các biểu tượng từ domain service
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();

    // Lấy email đã lưu trong session storage (nếu có)
    const currentEmail = sessionStorage.getItem('auth_email');

    // Khởi tạo form đăng nhập với trường email
    // Sử dụng email đã lưu hoặc chuỗi rỗng làm giá trị mặc định
    // Thêm các validator để kiểm tra email bắt buộc và đúng định dạng
    this.loginForm = this.fb.group({
      email: [currentEmail ?? '', [MessageableValidators.required('Please enter your email'), MessageableValidators.email('Please enter a valid email')]],
    });

    // Nếu có email đã lưu, đánh dấu form đã được tương tác
    if (currentEmail) {
      this.loginForm.markAsTouched();
    }

  }

  /**
   * Create full url of icon with icon path
   * @param path the path of icon
   * @returns full url of icon
   */
  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email } = this.loginForm.value;

      this.authService.identify({ email }).subscribe({
        next: (response: AuthIdentifyResponseDTO) => {

          sessionStorage.setItem('current-user-email', email);

          if (response.data.firstName) {
            sessionStorage.setItem('current-user-first-name', response.data.firstName);
          }

          if (response.data.lastName) {
            sessionStorage.setItem('current-user-last-name', response.data.lastName);
          }

          if (response.data.firstName) {
            this.router.navigate(['/authenticate/verification']);
          } else {
            this.router.navigate(['/authenticate/initialization']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send verification code';
          if (error.error?.details) {
            for (const field of Object.keys(error.error?.details)) {
              this.loginForm.get(field)?.setErrors({
                server: {
                  message: error.error?.details[field]
                }
              })
            }
            this.loginForm.updateValueAndValidity();
          }
        },
      });
    }
  }

  loginWithGoogle() {
    // Mock Google login
    // TODO: implement feature
  }
}
