import { Component, OnInit } from "@angular/core";
import { AuthenticateService } from "../../../core/services/authenticate.service";


@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [],
  template: ''
})
export class LogoutComponent implements OnInit {


  constructor(
    protected authenticateService: AuthenticateService
  ) {
  }

  ngOnInit() {
    this.authenticateService.signOut().subscribe();
  }


}
