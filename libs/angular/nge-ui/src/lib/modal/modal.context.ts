import { OverlayRef } from "@angular/cdk/overlay";
import { Observable, Subject } from "rxjs";

// Strongly typed modal context
export class ModalContext<R = void> {
  private afterClosed$ = new Subject<R | null>();
  private closed = false;

  constructor(private overlay: OverlayRef) {}

  /** Đóng modal và trả về dữ liệu */
  close(result: R): void {
    if (this.closed) return;
    this.closed = true;
    this.afterClosed$.next(result);
    this.afterClosed$.complete();
    setTimeout(() => this.overlay.dispose(), 100);
  }

  /** Đóng modal mà không trả về dữ liệu */
  dismiss(): void {
    if (this.closed) return;
    this.closed = true;
    this.afterClosed$.next(null);
    this.afterClosed$.complete();
    setTimeout(() => this.overlay.dispose(), 100);
  }

  /** Lắng nghe sự kiện đóng modal */
  afterClosed(): Observable<R | null> {
    return this.afterClosed$.asObservable();
  }

  /** Kiểm tra modal đã đóng chưa */
  isOpen(): boolean {
    return !this.closed;
  }
}
