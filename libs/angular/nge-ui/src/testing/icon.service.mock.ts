import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from "@angular/core";
import { of } from "rxjs";
import { IconService } from "../lib/icon/icon.service";

export function provideIconTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: IconService, useClass: IconServiceMock },
  ]);
}

@Injectable({ providedIn: "root" })
export class IconServiceMock {
  private sourceMap: { [source: string]: string } = {};

  getSvg(path: string) {
    return of(this.sourceMap[path] || "<svg></svg>");
  }

  setSvgMock(path: string, svg: string) {
    this.sourceMap[path] = svg;
  }
}
