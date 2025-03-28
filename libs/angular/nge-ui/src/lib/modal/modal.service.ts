import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable, InjectionToken, Injector, Type } from "@angular/core";
import { LoggerService } from "@ecoma/nge-logging";
import { ModalContext } from "./modal.context";

// Injection tokens
export const MODAL_DATA = new InjectionToken<unknown>("MODAL_DATA");
export const MODAL_CONTEXT = new InjectionToken<ModalContext>("MODAL_CONTEXT");

@Injectable({ providedIn: "root" })
export class ModalService {
  private logger: LoggerService;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.create(ModalService.name);
  }

  open<TData = unknown, TResult = void, TComponent = unknown>(component: Type<TComponent>, data?: TData) {
    this.logger.debug("Open modal", { component, data });
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: [
        "cdk-overlay-dark-backdrop",
        "animate-in",
        "fade-in",
        "duration-200",
        "backdrop-blur-[2px]",
      ],
      panelClass: [
        "cdk-overlay-panel",
        "animate-in",
        "zoom-in",
        "duration-100",
      ],
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically("-8rem"),
    });

    const context = new ModalContext<TResult>(overlayRef);

    overlayRef.backdropClick().subscribe(() => {
      this.shakePanel(overlayRef);
    });

    const injector = Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: data },
        { provide: MODAL_CONTEXT, useValue: context },
      ],
      parent: this.injector,
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    setTimeout(() => {
      overlayRef.overlayElement.classList.remove("animate-in");
      overlayRef.overlayElement.classList.remove("zoom-in");
    }, 100);

    context.afterClosed().subscribe(() => {
      overlayRef.overlayElement.classList.add("animate-out");
      overlayRef.overlayElement.classList.add("fade-out");
      overlayRef.overlayElement.classList.add("opacity-0");
    });

    return context.afterClosed();
  }

  private shakePanel(overlayRef: OverlayRef) {
    overlayRef.overlayElement.classList.add("animate-shake");
    overlayRef.overlayElement.classList.add("!duration-300");
    setTimeout(() => {
      overlayRef.overlayElement.classList.remove("animate-shake");
      overlayRef.overlayElement.classList.remove("!duration-300");
    }, 300); // Thời gian giữ hiệu ứng rung là 500ms, bạn có thể tùy chỉnh
  }
}
