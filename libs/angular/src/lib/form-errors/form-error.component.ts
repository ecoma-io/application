import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "nge-form-error",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div *ngIf="invalid && message" class="label">
      <div class="label-text-alt flex gap-1 items-center">
        <span class="text-error">{{ message }}</span>
      </div>
    </div>
  `,
})
export class FormError {
  @Input() control!: AbstractControl | null;

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
        // eslint-disable-next-line no-console
        console.warn(
          "ValidationErrors should be object with value is string. We will use it for display instruction for user edit control. (Tips: use MessageableValidators)"
        );
        return null;
      }
    }
    return null;
  }
}
