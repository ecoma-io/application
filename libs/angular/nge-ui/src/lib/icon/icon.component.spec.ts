import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import {
  IconServiceMock,
  provideIconTesting,
} from "../../testing/icon.service.mock";
import { IconComponent } from "./icon.component";

describe("IconComponent", () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let mockIconService: IconServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
      providers: [provideIconTesting()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    mockIconService = TestBed.inject(IconServiceMock);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch and display SVG content", () => {
    jest.spyOn(mockIconService, "getSvg").mockReturnValue(of("Mocked SVG"));

    // Mock trả về nội dung SVG

    component.path = "valid-path.svg";
    fixture.detectChanges();

    // Simulate the async request to get the SVG content
    component.initSource();

    // Wait for async operation
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const svgElement = fixture.nativeElement.querySelector("svg");
      expect(svgElement).toBeTruthy();
      expect(svgElement.innerHTML).toBe("Mocked SVG");
    });
  });

  it("should handle error gracefully", () => {
    // Mock trả về lỗi
    jest
      .spyOn(mockIconService, "getSvg")
      .mockReturnValue(throwError(() => new Error("Error loading SVG")));

    component.path = "error";
    fixture.detectChanges();

    // Simulate the error scenario
    component.initSource();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorDiv = fixture.nativeElement.querySelector(".error");
      expect(errorDiv).toBeTruthy();
      expect(errorDiv.innerHTML).toBe("Error loading SVG");
    });
  });

  it("should emit inserted event after SVG is loaded", () => {
    const emittedEventSpy = jest.spyOn(component.inserted, "emit");

    // Mock trả về nội dung SVG
    jest.spyOn(mockIconService, "getSvg").mockReturnValue(of("Mocked SVG"));

    component.path = "valid-path.svg";
    fixture.detectChanges();

    // Simulate the SVG being loaded and inserted into the DOM
    component.initSource();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(emittedEventSpy).toHaveBeenCalled();
    });
  });
});
