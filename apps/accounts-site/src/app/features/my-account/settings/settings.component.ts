import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold my-8">Settings</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <!-- Security Settings -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">Security Settings</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Authenticator App</p>
                  <p class="text-sm text-base-content/70">Add an extra layer of security</p>
                </div>
                <input type="checkbox" class="toggle toggle-primary" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Backup Codes</p>
                  <p class="text-sm text-base-content/70">Make account recoverable</p>
                </div>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">Preferences</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Email Notifications</p>
                  <p class="text-sm text-base-content/70">Receive email updates</p>
                </div>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">SMS Notifications</p>
                  <p class="text-sm text-base-content/70">Get SMS alerts</p>
                </div>
                <input type="checkbox" class="toggle toggle-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  isLoading = false;

  constructor(private fb: FormBuilder, private title: Title) {
    this.title.setTitle('Settings');
  }
}
