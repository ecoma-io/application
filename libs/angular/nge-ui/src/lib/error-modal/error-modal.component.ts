import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Dict } from "@ecoma/common-types";
import { IconComponent } from "../icon/icon.component";
import { MODAL_CONTEXT, MODAL_DATA, ModalContext } from "../modal";

export interface IErrorModalAction {
  id: unknown;
  label: string;
  classes?: string | Dict<boolean>;
  countdown?: boolean; // Hiển thị countdown trên nút
}

export interface IErrorModalData {
  icon?: string;
  title?: string;
  message: string;
  cancelByButton?: boolean;
  cancelByEscKey?: boolean;
  autoRetryAfter?: number; // Thời gian tự động đóng (seconds)
  primaryAction?: IErrorModalAction;
  secondaryAction?: IErrorModalAction;
}

@Component({
  selector: "nge-error-modal",
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="relative flex flex-col items-center max-w-md bg-base-100 rounded-xl p-6 m-6 sm:mx-0"
    >
      <button
        *ngIf="data.cancelByButton !== false"
        class="absolute right-4 top-4 !w-6 !h-6 hover:bg-neutral/20 rounded-full p-1"
        (click)="onDismiss()"
      >
        <nge-icon class="fill-current h-full w-full" path="regular/xmark.svg" />
      </button>

      <nge-icon
        *ngIf="data.icon"
        class="fill-error h-24 w-24"
        [path]="data.icon"
      />

      <h3 *ngIf="data.title" class="text-current text-2xl font-medium mt-4">
        {{ data.title }}
      </h3>

      <p class="leading-7 mt-4 text-center">{{ data.message }}</p>

      <div class="flex justify-center w-full space-x-3 mt-8">
        <!-- Nút mặc định nếu không có hành động -->
        <button
          *ngIf="!data.primaryAction && !data.secondaryAction"
          class="btn btn-primary"
          (click)="onDismiss()"
        >
          Dismiss
        </button>

        <!-- Secondary Action -->
        <button
          *ngIf="data.secondaryAction"
          [ngClass]="data.secondaryAction.classes"
          class="btn"
          (click)="context.close(data.secondaryAction)"
        >
          {{ data.secondaryAction.label }}<span *ngIf="data.secondaryAction.countdown && countdownValue > 0"
            > ({{ countdownValue + "s" }})</span
          >
        </button>

        <!-- Primary Action -->
        <button
          *ngIf="data.primaryAction"
          [ngClass]="data.primaryAction.classes"
          class="btn btn-primary"
          (click)="context.close(data.primaryAction)"
        >
          {{ data.primaryAction.label }}<span *ngIf="data.primaryAction.countdown && countdownValue > 0"
            > ({{ countdownValue + "s" }})</span
          >
        </button>
      </div>
    </div>
  `,
})
export class ErrorModalComponent implements OnInit, OnDestroy {
  private autoCloseTimer?: ReturnType<typeof setTimeout>;
  private countdownInterval?: ReturnType<typeof setInterval>;
  protected countdownValue = 0;

  constructor(
    @Inject(MODAL_CONTEXT) protected context: ModalContext<IErrorModalAction>,
    @Inject(MODAL_DATA) protected data: IErrorModalData
  ) {}

  ngOnInit() {
    if (this.data.autoRetryAfter && this.data.autoRetryAfter > 0) {
      this.countdownValue = this.data.autoRetryAfter;

      // Bắt đầu countdown mỗi giây
      this.countdownInterval = setInterval(() => {
        if (this.countdownValue > 0) {
          this.countdownValue--;
        }
      }, 1000);

      // Tự động đóng modal sau thời gian đã định (chuyển từ giây sang mili giây)
      this.autoCloseTimer = setTimeout(() => {
        this.onDismiss();
      }, this.data.autoRetryAfter * 1000);
    }
  }

  @HostListener("document:keyup", ["$event"])
  protected onEscKeyPressed(event: KeyboardEvent) {
    if (event.key == "Escape" && this.data.cancelByEscKey !== false) {
      this.onDismiss();
    }
  }

  protected onDismiss() {
    if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.context.dismiss();
  }

  ngOnDestroy() {
    if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
}
