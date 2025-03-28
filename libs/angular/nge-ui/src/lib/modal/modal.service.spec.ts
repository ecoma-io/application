import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { TestBed } from "@angular/core/testing";
import { MockFactory } from "@ecoma/common-testing";
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
      dispose: MockFactory.createMockFn(),
      attach: MockFactory.createMockFn(),
      backdropClick: MockFactory.createMockFn().mockReturnValue(
        backdropClick$.asObservable()
      ),
      hasAttached: MockFactory.createMockFn(),
      detach: MockFactory.createMockFn(),
      updateSize: MockFactory.createMockFn(),
      updatePosition: MockFactory.createMockFn(),
      updateScrollStrategies: MockFactory.createMockFn(),
      detachBackdrop: MockFactory.createMockFn(),
      getConfig: MockFactory.createMockFn(),
    } as unknown as jest.Mocked<OverlayRef>;

    overlayMock = {
      create: MockFactory.createMockFn(() => overlayRefMock),
      position: MockFactory.createMockFn(() => ({
        global: MockFactory.createMockFn(() => ({
          centerHorizontally: MockFactory.createMockFn(() => ({
            centerVertically: MockFactory.createMockFn(() => ({})),
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
