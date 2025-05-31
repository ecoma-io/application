import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SvgInjector } from '@ecoma/nge-svg-injector';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgInjector],
  providers: [],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold my-8">Profile Information</h1>

      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div class="form-control">
                <label class="label" for="fullNameInput">
                  <span class="label-text font-medium">Full Name</span>
                </label>
                <div class="relative">
                  <nge-svg-injector name="heroUser" class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"> </nge-svg-injector>
                  <input
                    type="text"
                    formControlName="fullName"
                    placeholder="Enter your full name"
                    class="input input-bordered w-full pl-10"
                    id="fullNameInput"
                  />
                </div>
                <label class="label" *ngIf="profileForm.get('fullName')?.touched && profileForm.get('fullName')?.invalid" for="fullNameInput">
                  <span class="label-text-alt text-error">Name must be between 2 and 50 characters</span>
                </label>
              </div>

              <!-- Email -->
              <div class="form-control">
                <label class="label" for="emailInput">
                  <span class="label-text font-medium">Email Address</span>
                </label>
                <div class="relative">
                  <nge-svg-injector name="heroEnvelope" class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"> </nge-svg-injector>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="Enter your email"
                    class="input input-bordered w-full pl-10"
                    id="emailInput"
                  />
                </div>
                <label class="label" *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.invalid" for="emailInput">
                  <span class="label-text-alt text-error">Please enter a valid email address</span>
                </label>
              </div>

              <!-- Phone -->
              <div class="form-control">
                <label class="label" for="phoneInput">
                  <span class="label-text font-medium">Phone Number</span>
                </label>
                <div class="relative">
                  <nge-svg-injector name="heroPhone" class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"> </nge-svg-injector>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="+1 (555) 000-0000"
                    class="input input-bordered w-full pl-10"
                    id="phoneInput"
                  />
                </div>
                <label class="label" *ngIf="profileForm.get('phone')?.touched && profileForm.get('phone')?.invalid" for="phoneInput">
                  <span class="label-text-alt text-error">Please enter a valid phone number</span>
                </label>
              </div>

              <!-- Date of Birth -->
              <div class="form-control">
                <label class="label" for="dateOfBirthInput">
                  <span class="label-text font-medium">Date of Birth</span>
                </label>
                <div class="relative">
                  <nge-svg-injector name="heroCalendar" class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"> </nge-svg-injector>
                  <input type="date" formControlName="dateOfBirth" class="input input-bordered w-full pl-10" id="dateOfBirthInput" />
                </div>
                <label
                  class="label"
                  *ngIf="profileForm.get('dateOfBirth')?.touched && profileForm.get('dateOfBirth')?.invalid"
                  for="dateOfBirthInput"
                >
                  <span class="label-text-alt text-error">You must be at least 18 years old</span>
                </label>
              </div>
            </div>

            <!-- Address -->
            <div class="form-control">
              <label class="label" for="addressInput">
                <span class="label-text font-medium">Address</span>
              </label>
              <div class="relative">
                <nge-svg-injector name="heroMapPin" class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"> </nge-svg-injector>
                <input
                  type="text"
                  formControlName="address"
                  placeholder="Enter your address"
                  class="input input-bordered w-full pl-10"
                  id="addressInput"
                />
              </div>
              <label class="label" *ngIf="profileForm.get('address')?.touched && profileForm.get('address')?.invalid" for="addressInput">
                <span class="label-text-alt text-error">Address is required</span>
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4">
              <button type="button" class="btn btn-ghost" (click)="resetForm()">Reset</button>
              <button type="submit" class="btn btn-primary" [disabled]="!profileForm.valid || isLoading">
                <span class="loading loading-spinner" *ngIf="isLoading"></span>
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private title: Title) {
    this.title.setTitle('Profile');
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Load user data
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.profileForm.patchValue({
        fullName: user.name,
        email: user.email,
      });
    }
  }

  ageValidator(control: any) {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underage: true };
  }

  getInitials(): string {
    const name = this.profileForm.get('fullName')?.value || '';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  resetForm() {
    this.profileForm.reset();
    this.ngOnInit();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Show success message
      }, 1500);
    }
  }
}
