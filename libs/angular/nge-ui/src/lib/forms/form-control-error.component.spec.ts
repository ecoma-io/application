import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { provideIconTesting } from "../../testing/icon.service.mock";
import { FormFieldErrorComponent } from "./form-control-error.component";

describe("FormFieldErrorComponent", () => {
  let component: FormFieldErrorComponent;
  let fixture: ComponentFixture<FormFieldErrorComponent>;
  let control: AbstractControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormFieldErrorComponent],
      providers: [provideLoggerTesting(), provideIconTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldErrorComponent);
    component = fixture.componentInstance;

    // Create a simple FormControl to simulate errors
    control = new FormControl("", { validators: [] });

    // Set input for control
    component.control = control;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display error message when control is invalid", () => {
    // Simulate an error with a message
    control.setErrors({ required: { message: "This field is required" } });
    control.markAsTouched();

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(".label");
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain("This field is required");
  });

  it("should not display error when control is valid", () => {
    control.setErrors(null); // Valid control
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(".label");
    expect(errorElement).toBeNull();
  });

  it("should not display error if control is not touched", () => {
    control.setErrors({ required: { message: "This field is required" } });
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(".label");
    expect(errorElement).toBeNull();
  });
});
