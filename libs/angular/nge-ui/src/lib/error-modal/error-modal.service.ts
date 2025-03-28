import { HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { LoggerService } from "@ecoma/nge-logging";
import { WA_NAVIGATOR } from "@ng-web-apis/common";
import { ModalService } from "../modal";
import {
  IErrorModalAction,
  ErrorModalComponent,
  IErrorModalData,
} from "./error-modal.component";

@Injectable({ providedIn: "root" })
export class ErrorModalService {
  private logger: LoggerService;

  constructor(
    @Inject(WA_NAVIGATOR) private navigator: Navigator,
    private modalService: ModalService,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.create(ErrorModalService.name);
  }

  public handleGenericError(
    err: unknown,
    retryFunc?: () => void,
    autoRetryAfter?: number
  ) {
    if (
      err instanceof HttpErrorResponse &&
      err.status === 0 &&
      !this.navigator.onLine
    ) {
      this.logger.error("No internet connection!", { err });
      this.showErrorModal(
        "An unstable connection problem has been detected. Please check your connection again.",
        {
          icon: "duotone/wifi-slash.svg",
          title: "No Internet",
          retryFunc,
          autoRetryAfter,
        }
      );
    } else if (err instanceof HttpErrorResponse && err.status >= 500) {
      this.logger.error("Internal Server Error", { err });
      this.showErrorModal(
        "We're experiencing some technical difficulties on our end. Please try again later or contact support if the issue persists.",
        {
          icon: "duotone/link-horizontal-slash.svg",
          title: "Connection to server has problem",
          retryFunc,
          autoRetryAfter,
        }
      );
    } else {
      this.logger.fatal("Internal Client Error", { err });
      this.showErrorModal(
        "An unforeseen error has occurred. Please try again later or contact us if the issue persists.",
        {
          icon: "duotone/triangle-exclamation.svg",
          title: "Oops, Something Went Wrong",
          retryFunc,
          autoRetryAfter,
        }
      );
    }
  }

  public showErrorModal(
    message: string,
    options?: {
      title?: string;
      icon?: string;
      message?: string;
      retryFunc?: () => void;
      autoRetryAfter?: number;
    }
  ) {
    const subscription = this.modalService.open<
      IErrorModalData,
      IErrorModalAction
    >(ErrorModalComponent, {
      message: message,
      title: options?.title,
      icon: options?.icon,
      autoRetryAfter: options?.autoRetryAfter,
      primaryAction: {
        id: "retry",
        label: "Retry",
        classes: "min-w-24",
        countdown:
          (options?.autoRetryAfter && options?.autoRetryAfter > 0) || false,
      },
      secondaryAction: {
        id: "cancel",
        classes: "min-w-24",
        label: "Cancel",
      },
    });

    subscription.subscribe((action) => {
      this.logger.debug(`Error modal response action= ${action}`);
      if (action?.id === "retry" && options?.retryFunc) {
        options.retryFunc();
      }
    });
  }
}
