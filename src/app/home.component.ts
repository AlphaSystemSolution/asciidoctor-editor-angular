import { Component } from '@angular/core';
import { AuthService } from './shared/service/auth.service';

@Component({
  selector: 'home',
  template: `<div>
              <h3>HOME &mdash; Logged in as {{ auth.displayName }}</h3>
            </div>`
})
export class HomeComponent {

  constructor(private auth: AuthService) {
  }
}
