import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService) {
  }

  public ngOnInit() {
    console.log('inside NavbarComponent: %s', this.auth);
  }

  public isLoggedIn(){
    return this.auth.authenticated();
  }

}
