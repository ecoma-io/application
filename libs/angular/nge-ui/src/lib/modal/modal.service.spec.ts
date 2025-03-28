import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { TestBed } from "@angular/core/testing";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { Observable, Subject } from "rxjs";
import { ModalService } from "./modal.service";

jest.useFakeTimers();

describe("ModalService", () => {
  let service: ModalService;
  let overlayMock: jest.Mocked<Overlay>;
  let overlayRefMock: jest.Mocked<OverlayRef>;
  let backdropClick$: Subject<MouseEvent>;

  beforeEach(() => {
    backdropClick$ = new Subject<MouseEvent>();

    overlayRefMock = {
      dispose: jest.fn(),
      attach: jest.fn(),
      backdropClick: jest.fn().mockReturnValue(backdropClick$.asObservable()),
      hasAttached: jest.fn(),
      detach: jest.fn(),
      updateSize: jest.fn(),
      updatePosition: jest.fn(),
      updateScrollStrategies: jest.fn(),
      detachBackdrop: jest.fn(),
      getConfig: jest.fn(),
    } as unknown as jest.Mocked<OverlayRef>;

    overlayMock = {
      create: jest.fn(() => overlayRefMock),
      position: jest.fn(() => ({
        global: jest.fn(() => ({
          centerHorizontally: jest.fn(() => ({
            centerVertically: jest.fn(() => ({})),
          })),
        })),
      })),
    } as unknown as jest.Mocked<Overlay>;

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: Overlay, useValue: overlayMock },
        provideLoggerTesting(),
      ],
    });

    service = TestBed.inject(ModalService);
  });

  it("should open a modal and return Observable", () => {
    const modalContext = service.open(TestComponent, { closeable: true });
    expect(overlayMock.create).toHaveBeenCalled();
    expect(overlayRefMock.attach).toHaveBeenCalledWith(
      expect.any(ComponentPortal)
    );
    expect(modalContext).toBeInstanceOf(Observable);
  });
});

class TestComponent {}
