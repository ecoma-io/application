import { SvgInjector } from '@ecoma/nge-svg-injector';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Domains } from '@ecoma/nge-domain';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgInjector],
  template: `
    <div class="min-h-screen relative bg-gradient-to-br from-base-300 to-base-100 flex items-center justify-center p-4 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-[800px] h-[800px] -top-[400px] -left-[400px]">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full filter blur-3xl pulse-slow"></div>
        </div>
        <div class="absolute w-[600px] h-[600px] -bottom-[300px] -right-[300px]">
          <div
            class="absolute inset-0 bg-gradient-to-br from-secondary/40 to-accent/40 rounded-full filter blur-3xl pulse-slow"
            style="animation-delay: -4s;"
          ></div>
        </div>
      </div>

      <div class="card w-full max-w-md bg-base-100/70 glass-effect shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
        <div class="card-body space-y-8">
          <!-- Header -->
          <div class="text-center space-y-3">
            <div class="avatar placeholder mb-4 floating">
              <div class="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary rounded-full w-24">
                <nge-svg-injector path="/icon.svg" class="p-4" />
              </div>
            </div>
            <h1 class="text-4xl font-bold text-base-content">Welcome Back</h1>
            <p class="text-base-content/70">Sign in to your account or create a new one instantly</p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                />
              </div>
              <label class="label" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" for="email">
                <span class="label-text-alt text-error flex items-center gap-1">
                  <nge-svg-injector [path]="iconUrl('/duotone/exclamation.svg')" class="w-4 h-4"></nge-svg-injector>
                  Please enter a valid email
                </span>
              </label>
            </div>

            <div class="alert alert-error shadow-lg" *ngIf="errorMessage">
              <nge-svg-injector [path]="iconUrl('/duotone/exclamation.svg')" class="w-6 h-6"></nge-svg-injector>
              <span>{{ errorMessage }}</span>
            </div>

            <div class="space-y-4">
              <button
                type="submit"
                class="btn btn-primary w-full min-h-12 shadow-lg hover:shadow-primary/30 transition-all duration-300"
                [disabled]="!loginForm.valid || isLoading"
              >
                <span class="loading loading-spinner" *ngIf="isLoading"></span>
                {{ isLoading ? 'Sending Code...' : 'Continue with Email' }}
              </button>

              <div class="divider text-base-content/50">OR</div>

              <button
                type="button"
                class="btn bg-base-100 hover:bg-base-200 w-full gap-2 min-h-12 transition-all duration-300 border-2"
                (click)="loginWithGoogle()"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          </form>

          <!-- Footer -->
          <div class="text-center space-y-2">
            <p class="text-sm text-base-content/70">By continuing, you agree to our</p>
            <div class="flex justify-center gap-2 text-sm">
              <a href="#" class="link link-hover text-primary">Terms of Service</a>
              <span class="text-base-content/50">&</span>
              <a href="#" class="link link-hover text-primary">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  iconsBaseUrl: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private domain: Domains) {
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email } = this.loginForm.value;
      this.authService.requestOTP(email).subscribe({
        next: () => {
          sessionStorage.setItem('auth_email', email);
          this.router.navigate(['/auth/verify']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to send verification code';
        },
      });
    }
  }

  loginWithGoogle() {
    // Mock Google login
    // this.authService.handleGoogleLogin({
    //   id: 'mock_id',
    //   email: 'user@gmail.com',
    //   name: 'Test User',
    //   photoUrl: 'https://example.com/photo.jpg'
    // }).subscribe({
    //   next: () => {
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     this.errorMessage = error.message || 'Failed to login with Google';
    //   }
    // });
  }
}
