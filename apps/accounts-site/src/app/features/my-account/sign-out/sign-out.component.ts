import { Component, OnInit } from "@angular/core";
import { AuthenticateService } from "../../../core/services/authenticate.service";


@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [],
  template: ''
})
export class SignOutComponent implements OnInit {


  constructor(
    protected authenticateService: AuthenticateService
  ) {
  }

  ngOnInit() {
    this.authenticateService.signOut().subscribe();
  }


}
