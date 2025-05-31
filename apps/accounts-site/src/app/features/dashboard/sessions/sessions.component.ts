import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

interface ISession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrentSession: boolean;
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold my-8">Active Sessions</h1>
        <button class="btn btn-neutral" (click)="terminateAllSessions()" [disabled]="isLoading">Terminate All Other Sessions</button>
      </div>

      <div class="space-y-4">
        <div *ngFor="let session of sessions" class="card bg-base-300">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold flex items-center gap-2">
                  {{ session.device }}
                  <span class="badge badge-primary" *ngIf="session.isCurrentSession">Current Session</span>
                </h3>
                <p class="text-sm opacity-70">{{ session.browser }}</p>
                <div class="text-sm mt-2">
                  <p>Location: {{ session.location }}</p>
                  <p>Last Active: {{ session.lastActive | date : 'medium' }}</p>
                </div>
              </div>
              <button class="btn btn-sm btn-error" (click)="terminateSession(session.id)" [disabled]="session.isCurrentSession || isLoading">
                Terminate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="sessions.length === 0" class="text-center py-8">
        <p class="text-lg">No active sessions found</p>
      </div>
    </div>
  `,
})
export class SessionsComponent implements OnInit {
  sessions: ISession[] = [];
  isLoading = false;

  constructor(private title: Title) {
    this.title.setTitle('Sessions');
  }

  ngOnInit() {
    // Mock data
    this.sessions = [
      {
        id: '1',
        device: 'Windows 10 PC',
        browser: 'Chrome 120.0.0',
        ip: '192.168.1.1',
        location: 'New York, United States',
        lastActive: new Date(),
        isCurrentSession: true,
      },
      {
        id: '2',
        device: 'iPhone 13',
        browser: 'Safari 15.0',
        ip: '192.168.1.2',
        location: 'Los Angeles, United States',
        lastActive: new Date(Date.now() - 3600000),
        isCurrentSession: false,
      },
    ];
  }

  terminateSession(sessionId: string) {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.sessions = this.sessions.filter((session) => session.id !== sessionId);
      this.isLoading = false;
    }, 1000);
  }

  terminateAllSessions() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.sessions = this.sessions.filter((session) => session.isCurrentSession);
      this.isLoading = false;
    }, 1000);
  }
}
