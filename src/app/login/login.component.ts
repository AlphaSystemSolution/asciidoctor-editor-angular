import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message } from 'primeng/primeng';
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

  onSubmit(value: any) {
    this.msgs = [];
    // TODO: call AuthService to login
    this.router.navigate(['']);
  }
}
