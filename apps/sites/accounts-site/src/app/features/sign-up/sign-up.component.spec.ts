import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { of } from "rxjs";
import { SignUpComponent } from "./sign-up.component";

describe("SignUpComponent", () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
        provideLoggerTesting(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
