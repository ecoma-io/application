import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-main-layout",
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss",
})
export class MainLayoutComponent {}
