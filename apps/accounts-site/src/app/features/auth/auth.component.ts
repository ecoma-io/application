import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  template: `
    <div class="min-h-screen relative h-screen bg-base-300 flex items-center justify-center p-4 overflow-hidden">
      <div class="card w-full max-w-md bg-base-100/70 glass-effect shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
        <div class="card-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent {}
