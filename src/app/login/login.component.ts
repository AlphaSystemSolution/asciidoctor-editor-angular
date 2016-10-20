import { Component } from '@angular/core';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private auth: AuthService) {
  }
}
