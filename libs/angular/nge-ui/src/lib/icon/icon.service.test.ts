import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideLoggerTesting } from "@ecoma/nge-logging/testing";
import { WA_LOCATION } from "@ng-web-apis/common";
import { IconService } from "./icon.service";

describe("IconService", () => {
  let service: IconService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IconService,
        provideHttpClient(), // Cung cấp HttpClient
        provideHttpClientTesting(), // Mock HttpClient để test
        provideLoggerTesting(),
        { provide: WA_LOCATION, useValue: { host: "example.com" } }, // Mock WA_LOCATION
      ],
    });

    service = TestBed.inject(IconService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch SVG and cache it", () => {
    const mockSvg = "<svg></svg>";
    const testUrl = "https://icons.example.com/test.svg";

    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe('<div class="animate-pulse bg-base-300/50"></div>'); // Skeleton
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe("GET");

    req.flush(mockSvg);

    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe(mockSvg); // SVG được cache
    });
  });

  it("should return skeleton loader while fetching SVG", () => {
    const testUrl = "https://icons.example.com/test.svg";

    // Gọi getSvg và kiểm tra skeleton loader ngay lập tức
    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe('<div class="animate-pulse bg-base-300/50"></div>'); // Skeleton
    });

    // Kiểm tra HTTP request đã được thực hiện
    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe("GET");

    // Giả lập phản hồi HTTP
    req.flush("<svg></svg>");

    // Sau khi yêu cầu HTTP hoàn tất, kiểm tra lại xem svg đã được trả về
    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe("<svg></svg>"); // SVG đã được cache và trả về
    });

    // Kiểm tra rằng không còn yêu cầu HTTP nào còn lại
    httpMock.verify();
  });

  it("should handle failed requests gracefully", () => {
    const testUrl = "https://icons.example.com/test.svg";

    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe('<div class="animate-pulse bg-base-300/50"></div>'); // Skeleton
    });

    const req = httpMock.expectOne(testUrl);
    req.error(new ErrorEvent("Network error"));

    service.getSvg("test.svg").subscribe((svg) => {
      expect(svg).toBe(""); // Trả về rỗng khi lỗi
    });
  });
});
