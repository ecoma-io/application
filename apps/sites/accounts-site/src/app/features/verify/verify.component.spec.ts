import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { of } from "rxjs";
import { VerifyComponent } from "./verify.component";

describe("VerifyComponent", () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyComponent],
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

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
