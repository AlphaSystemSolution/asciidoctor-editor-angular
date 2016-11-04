import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { AuthService } from '../shared/service/auth.service';
import { SignUpForm, ResponseCode } from '../shared/support/model';
import { CustomValidators } from '../shared/support/custom.validators';

@Component({
  templateUrl: './signup.component.html'
})
export class SignUpComponent implements OnInit {

  msgs: Message[] = [];
  signupForm: FormGroup;

  formFields: any = ['firstName', 'lastName', 'email', 'userName', 'password'];
  validationMessages: any = {
    'firstName': { 'required': 'First Name is required' },
    'lastName': { 'required': 'Last Name is required' },
    'email': {
      'required': 'Email is required',
      'emailFormat': 'Email format is invalid'
    },
    'userName': {
      'required': 'User Name is required',
      'userNameFormat': 'User Name format is invalid'
    },
    'password': {
      'required': 'Password is required',
      'minLength': 'Password should atleast be 6 characters long'
    }
  };

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) { }

  public ngOnInit() {
    this.signupForm = this.fb.group({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, CustomValidators.emailFormat]),
      'userName': new FormControl('', [Validators.required, CustomValidators.userNameFormat]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    this.msgs = [];
    if (!this.signupForm) {
      return;
    }

    this.formFields.forEach((field: string) => {
      const control = this.signupForm.get(field);
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          if (key) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: this.validationMessages[field][key]
            });
          }
        }
      }
    });
  }

  onSubmit(signupForm: SignUpForm) {
    this.msgs = [];
    let signupResult: any = this.auth.signup(signupForm.userName, signupForm.password,
      signupForm.email, signupForm.firstName, signupForm.lastName);
    let navigation: string = undefined;
    if (signupResult) {
      let code: ResponseCode = signupResult.result;
      switch (code) {
        case ResponseCode.SUCCESS:
          navigation = 'login';
          break;
        case ResponseCode.SYSTEM_ERROR:
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'System error occurred while signing up'
          });
          break;
        case ResponseCode.UNKNOWN_ERROR:
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Unknown error occurred while signing up'
          });
          break;
        default:
          break;
      }
    }
    if (navigation) {
      this.router.navigate([navigation]);
    }
  }
}
