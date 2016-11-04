import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { LoginForm } from '../shared/support/model';
import { AuthService } from '../shared/service/auth.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  msgs: Message[] = [];
  loginForm: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) { }

  public ngOnInit() {
    this.loginForm = this.fb.group({
      'userName': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  onSubmit(loginForm: LoginForm) {
    this.msgs = [];
    let loginResult: any = this.auth.login(loginForm.userName, loginForm.password);
    if (loginResult) {
      if (loginResult.result) {
        this.router.navigate(['']);
      } else {
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Could not log in'
        });
      }
    } else {
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Unknown error occurred while logging in'
      });
    }
  }
}
