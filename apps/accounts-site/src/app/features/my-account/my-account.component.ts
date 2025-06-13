import { Component } from '@angular/core';
import { AppLayoutComponent } from '@ecoma/angular';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [AppLayoutComponent],
  template: '<nge-app-layout></nge-app-layout>',
})
export class MyAccountComponent {}
