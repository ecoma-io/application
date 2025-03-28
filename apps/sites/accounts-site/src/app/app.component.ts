import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoggerService } from "@ecoma/nge-logging";

@Component({
  imports: [RouterModule],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "accounts-site";

  constructor(logger: LoggerService) {
    logger.info("test", { abc: 123 });
  }
}
