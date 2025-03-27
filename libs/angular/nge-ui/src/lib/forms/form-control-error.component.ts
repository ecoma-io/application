import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { LoggerService } from "@ecoma/nge-logging";
import { IconComponent } from "../icon";

@Component({
  selector: "nge-form-control-error",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent],
  template: `
    <div *ngIf="invalid && message" class="label">
      <div class="label-text-alt flex gap-1 items-center">
        <nge-icon
          class="h-3 !block fill-error"
          path="duotone/triangle-exclamation.svg"
        />
        <span class="text-error">{{ message }}</span>
      </div>
    </div>
  `,
})
export class FormFieldErrorComponent {
  @Input() control!: AbstractControl | null;
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger.create(FormFieldErrorComponent.name);
  }

  public get invalid(): boolean {
    return (
      this.control !== null && this.control.touched && this.control.invalid
    );
  }

  public get message(): string | null {
    if (this.control?.errors) {
      const firstError =
        this.control.errors[Object.keys(this.control.errors)[0]];
      if (typeof firstError === "object" && firstError["message"]) {
        return firstError["message"];
      } else {
        this.logger.warn(
          "ValidationErrors should be object with value is string. We will use it for display instruction for user edit control. (Tips: use MessageableValidators)"
        );
        return null;
      }
    }
    return null;
  }
}
