import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormError, MessageableValidators, SvgInjector, Domains } from '@ecoma/angular';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-initialization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgInjector, FormError],
  host: {
    class: 'space-y-12',
  },
  template: `
    <!-- Header -->
    <div class="text-center space-y-2">
      <div class="avatar placeholder">
        <div class="bg-primary/10 text-primary rounded-full w-24">
          <nge-svg-injector path="/icon.svg" class="w-12 h-12"> </nge-svg-injector>
        </div>
      </div>
      <h2 class="text-2xl font-bold" data-test-id="initialization-page-title">Account initialization</h2>
      <p class="text-base-content/70">
        Let people know who you are
      </p>
      <a routerLink="/authenticate/identification" class="flex justify-center text-primary" data-test-id="initialization-email-link">
        {{email}}
      </a>
    </div>

    <!-- Form -->
    <form [formGroup]="initializationForm" (ngSubmit)="onSubmit()" class="space-y-4">

    <div class="alert alert-error text-sm" *ngIf="errorMessage" data-test-id="initialization-main-error-message">
        <nge-svg-injector [path]="iconUrl('/duotone/triangle-exclamation.svg')" class="w-5 h-5"></nge-svg-injector>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- First Name -->
      <div>
        <label for="firstName" class="label">
          <span class="label-text">First Name</span>
        </label>
        <input type="text" id="firstName" formControlName="firstName" class="input input-bordered w-full" data-test-id="initialization-first-name-input" />
        <nge-form-error data-test-id="first-name-error" [control]="initializationForm.get('firstName')" />
      </div>

      <!-- Last Name -->
      <div>
        <label for="lastName" class="label">
          <span class="label-text">Last Name (Optional)</span>
        </label>
        <input type="text" id="lastName" formControlName="lastName" class="input input-bordered w-full" data-test-id="initialization-last-name-input" />
        <nge-form-error data-test-id="last-name-error"  [control]="initializationForm.get('lastName')" />
      </div>

      <button
          type="submit"
          class="btn btn-accent w-full !mt-12"
          [disabled]="!initializationForm.valid || isLoading"
          data-test-id="initialization-create-account-button">
          <span class="loading loading-spinner" *ngIf="isLoading"></span>
          Create account
        </button>
    </form>
  `,
})
export class InitializationComponent implements OnInit {
  iconsBaseUrl: string;
  initializationForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private domain: Domains,
    private title: Title
  ) {
    // Thiết lập tiêu đề cho trang web
    this.title.setTitle('Account initialization');

    // Lấy đường dẫn cơ sở cho các biểu tượng từ domain service
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();

    // Initialize the form group
    this.initializationForm = this.fb.group({
      firstName: ['', [MessageableValidators.required('Please enter your first name'), MessageableValidators.maxLength(18)]],
      lastName: ['', [MessageableValidators.maxLength(18)]]
    });
  }

  ngOnInit() {
    this.title.setTitle('Identity verification');
    const currentUserEmail = sessionStorage.getItem('current-user-email');
    if (!currentUserEmail) {
      this.router.navigate(['/authenticate/identification'], { queryParamsHandling: 'merge' });
      sessionStorage.removeItem('current-user-first-name');
      sessionStorage.removeItem('current-user-last-name');
      return;
    } else {
      this.email = currentUserEmail;
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
    if (this.initializationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { firstName, lastName } = this.initializationForm.value;

      sessionStorage.setItem('current-user-first-name', firstName);
      if (lastName && lastName !== '') {
        sessionStorage.setItem('current-user-last-name', lastName);
      } else {
        sessionStorage.removeItem('current-user-last-name');
      }

      this.router.navigate(['/authenticate/verification'], { queryParamsHandling: 'merge' });
    }
  }
}
