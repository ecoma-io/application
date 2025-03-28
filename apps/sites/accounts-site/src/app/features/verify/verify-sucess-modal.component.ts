import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { IconComponent, MODAL_CONTEXT, ModalContext } from "@ecoma/nge-ui";

@Component({
  selector: "app-verify-success-modal",
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="relative flex flex-col items-center max-w-md bg-base-100 rounded-xl p-6 m-6 sm:mx-0"
    >
      <nge-icon class="fill-success h-24 w-24" path="duotone/check.svg" />

      <h3 class="text-current text-2xl font-medium mt-4">
        {{ title }}
      </h3>

      <p class="leading-7 mt-4 text-center">{{ message }}</p>

      <div class="flex justify-center w-full space-x-3 mt-8">
        <button class="btn btn-primary" (click)="onDismiss()">
          {{ action }}
        </button>
      </div>
    </div>
  `,
})
export class VerifySuccessModalComponent {
  protected readonly title = "Verification successful!";
  protected readonly message =
    "Welcome to Ecoma, log in and unlock the power of your business.";
  protected readonly action = "Sign In";

  constructor(@Inject(MODAL_CONTEXT) protected context: ModalContext<void>) {}

  protected onDismiss() {
    this.context.close();
  }
}
