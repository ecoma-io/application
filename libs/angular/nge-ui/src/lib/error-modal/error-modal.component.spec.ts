import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { provideIconTesting } from "../../testing/icon.service.mock";
import { IconComponent } from "../icon/icon.component";
import { MODAL_CONTEXT, MODAL_DATA, ModalContext } from "../modal";
import {
  ErrorModalAction,
  ErrorModalComponent,
  ErrorModalData,
} from "./error-modal.component";

describe("ErrorModalComponent", () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let contextMock: jest.Mocked<ModalContext<ErrorModalAction>>;

  beforeEach(async () => {
    contextMock = {
      close: jest.fn(),
      dismiss: jest.fn(),
    } as unknown as jest.Mocked<ModalContext<ErrorModalAction>>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, IconComponent, ErrorModalComponent],
      providers: [
        provideLoggerTesting(),
        provideIconTesting(),
        { provide: MODAL_CONTEXT, useValue: contextMock },
        {
          provide: MODAL_DATA,
          useValue: {
            title: "Error",
            message: "Something went wrong",
          } as ErrorModalData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.resetAllMocks();
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
});
