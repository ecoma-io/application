import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { MockFactory } from "@ecoma/common-testing";
import { provideIconTesting } from "../../testing/icon.service.mock";
import { IconComponent } from "../icon/icon.component";
import { MODAL_CONTEXT, MODAL_DATA, ModalContext } from "../modal";
import {
  ErrorModalComponent,
  IErrorModalAction,
  IErrorModalData,
} from "./error-modal.component";

describe("ErrorModalComponent", () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let contextMock: jest.Mocked<ModalContext<IErrorModalAction>>;

  beforeEach(async () => {
    jest.useFakeTimers();
    contextMock = {
      close: MockFactory.createMockFn(),
      dismiss: MockFactory.createMockFn(),
    } as unknown as jest.Mocked<ModalContext<IErrorModalAction>>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        IconComponent,
        ErrorModalComponent,
      ],
      providers: [
        provideLoggerTesting(),
        provideIconTesting(),
        { provide: MODAL_CONTEXT, useValue: contextMock },
        {
          provide: MODAL_DATA,
          useValue: {
            title: "Error",
            message: "Something went wrong",
          } as IErrorModalData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the title and message", () => {
    const titleElement = fixture.debugElement.query(By.css("h3"));
    const messageElement = fixture.debugElement.query(By.css("p"));

    expect(titleElement.nativeElement.textContent.trim()).toBe("Error");
    expect(messageElement.nativeElement.textContent.trim()).toBe(
      "Something went wrong"
    );
  });

  it("should display icon if provided", () => {
    component["data"].icon = "error-icon.svg";
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css("nge-icon"));
    expect(iconElement).toBeTruthy();
  });

  it("should not close modal if cancelByEscKey is false", () => {
    component["data"].cancelByEscKey = false;
    fixture.detectChanges();

    const event = new KeyboardEvent("keyup", { key: "Escape" });
    window.dispatchEvent(event);

    expect(contextMock.dismiss).not.toHaveBeenCalled();
  });

  it("should close modal when dismiss button is clicked", () => {
    const dismissButton = fixture.debugElement.query(
      By.css("button.btn-primary")
    );
    dismissButton.nativeElement.click();

    expect(contextMock.dismiss).toHaveBeenCalled();
  });

  it("should handle primary and secondary actions", () => {
    const data: IErrorModalData = {
      message: "Test error message",
      primaryAction: {
        id: "primary",
        label: "Primary Action",
        classes: "btn-primary",
      },
      secondaryAction: {
        id: "secondary",
        label: "Secondary Action",
        classes: "btn-secondary",
      },
    };
    component["data"] = data;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css("button"));
    expect(buttons.length).toBe(3); // Including the dismiss button
    expect(buttons[1].nativeElement.textContent.trim()).toBe("Secondary Action");
    expect(buttons[2].nativeElement.textContent.trim()).toBe("Primary Action");
  });

  it("should handle countdown in actions", () => {
    const data: IErrorModalData = {
      message: "Test error message",
      autoRetryAfter: 5,
      primaryAction: {
        id: "primary",
        label: "Primary Action",
        countdown: true,
      },
    };
    component["data"] = data;
    component.ngOnInit(); // Call ngOnInit to initialize interval
    fixture.detectChanges();

    // Initial state
    const button = fixture.debugElement.query(By.css("button.btn-primary"));
    expect(button.nativeElement.textContent.trim()).toBe("Primary Action (5s)");

    // After 1 second
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(button.nativeElement.textContent.trim()).toBe("Primary Action (4s)");

    // After 2 more seconds
    jest.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(button.nativeElement.textContent.trim()).toBe("Primary Action (2s)");

    // After remaining time
    jest.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(contextMock.dismiss).toHaveBeenCalled();
  });
});
