import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SvgInjectorService {
  private sourceMap: { [source: string]: BehaviorSubject<string> } = {};

  constructor(
    private http: HttpClient,
  ) { }

  getSvg(source: string): Observable<string> {
    if (!this.sourceMap[source]) {
      this.sourceMap[source] = new BehaviorSubject<string>('<div class="animate-pulse bg-base-300/50"></div>');
      this.loadSvg(source);
    }
    return this.sourceMap[source].asObservable();
  }

  private loadSvg(source: string) {
    this.http
      .get(source, { observe: "response", responseType: "text", })
      .pipe(map((response) => response.body ?? ""))
      .subscribe((svg) => { this.sourceMap[source].next(svg) });
  }
}
