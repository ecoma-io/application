import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { getRootDomain } from "@ecoma/common-utils";
import { LoggerService } from "@ecoma/nge-logging";
import { WA_LOCATION } from "@ng-web-apis/common";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class IconService {
  private sourceMap: { [source: string]: BehaviorSubject<string> } = {};
  private logger: LoggerService;
  private iconsDomain: string;

  constructor(
    private http: HttpClient,
    @Inject(WA_LOCATION) private location: Location,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.create(IconService.name);
    this.iconsDomain = `icons.${getRootDomain(this.location.host)}`;
  }

  getSvg(path: string): Observable<string> {
    this.logger.debug("Getting svg source", { src: path });
    if (!path.startsWith("/") && !path.startsWith("http")) {
      path = `https://${this.iconsDomain}/${path}`;
    }
    if (!this.sourceMap[path]) {
      this.sourceMap[path] = new BehaviorSubject<string>(
        '<div class="animate-pulse bg-base-300/50"></div>'
      );
      this.loadSvg(path);
    }

    return this.sourceMap[path].asObservable();
  }

  private loadSvg(path: string) {
    this.http
      .get(path, {
        observe: "response",
        responseType: "text",
      })
      .pipe(map((response) => response.body ?? ""))
      .subscribe((svg) => {
        this.sourceMap[path].next(svg);
      });
  }
}
