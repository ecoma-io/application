import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SvgInjector } from '@ecoma/nge-svg-injector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, SvgInjector],
  template: `
    <div class="min-h-screen bg-base-200">
      <!-- Fixed Header -->
      <div class="fixed top-0 left-[280px] right-0 bg-base-100 z-10">
        <div class="navbar min-h-[70px] px-6">
          <div class="flex-1">
            <div class="text-sm breadcrumbs">
              <ul>
                <li>Home</li>
                <li>Account</li>
              </ul>
            </div>
          </div>
          <div class="flex-none gap-6">
            <!-- Helps -->
            <!-- <div class="flex items-center gap-4">
              <button class="btn btn-ghost btn-circle">
                <div class="indicator">
                  <nge-svg-injector path="heroBell" class="w-5 h-5"></nge-svg-injector>
                  <span class="badge badge-sm badge-primary indicator-item">2</span>
                </div>
              </button>
              <button class="btn btn-ghost btn-circle">
                <div class="indicator">
                  <nge-svg-injector path="heroEnvelope" class="w-5 h-5"></nge-svg-injector>
                  <span class="badge badge-sm badge-primary indicator-item">4</span>
                </div>
              </button>
            </div> -->

            <!-- User Menu -->
            <div class="dropdown dropdown-end">
              <div class="flex items-center gap-3" tabindex="0" role="button">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-xl w-10">
                    <span>{{ getUserInitials() }}</span>
                  </div>
                </div>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2">
                <li><a routerLink="profile">Profile</a></li>
                <li><a routerLink="settings">Settings</a></li>
                <li><hr class="my-1" /></li>
                <li><button (click)="logout()">Sign Out</button></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Rounded corner decoration -->
        <div class="absolute left-0 top-[70px] w-6 h-6 bg-base-100">
          <div class="absolute inset-0 bg-base-200/50 rounded-tl-xl"></div>
        </div>
      </div>

      <!-- Fixed Sidebar -->
      <div class="fixed top-0 left-0 h-screen w-[280px] bg-base-100 z-20 flex flex-col">
        <!-- Logo -->
        <div class="p-6">
          <div class="flex items-center gap-1">
            <img src="logo.svg" alt="Ecoma logo" class="h-4" />
            <p class="text-xl opacity-50">Account</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6">
          <ul class="menu menu-lg gap-2">
            <li>
              <a routerLink="profile" routerLinkActive="active" class="flex items-center gap-4 min-h-12 rounded-xl">
                <nge-svg-injector path="heroUser" class="w-5 h-5"></nge-svg-injector>
                Profile
              </a>
            </li>
            <li>
              <a routerLink="sessions" routerLinkActive="active" class="flex items-center gap-4 min-h-12 rounded-xl">
                <nge-svg-injector path="heroComputerDesktop" class="w-5 h-5"></nge-svg-injector>
                Sessions
              </a>
            </li>
            <li>
              <a routerLink="settings" routerLinkActive="active" class="flex items-center gap-4 min-h-12 rounded-xl">
                <nge-svg-injector path="heroCog6Tooth" class="w-5 h-5"></nge-svg-injector>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="pl-[280px] pt-[70px]">
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  getUserInitials(): string {
    const name = this.getUserName();
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getUserName(): string {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || 'User';
    }
    return 'User';
  }

  getUserEmail(): string {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      return user.email || 'user@example.com';
    }
    return 'user@example.com';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
