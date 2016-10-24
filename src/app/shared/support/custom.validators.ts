import { AbstractControl } from '@angular/forms';

export class CustomValidators {

  public static emailFormat(formControl: AbstractControl): { [key: string]: boolean } {
    let pattern: RegExp = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]){2,4}/;
    let email: string = formControl.value;
    let result: boolean = pattern.test(email);
    return result ? null : { 'emailFormat': true };
  }

  public static userNameFormat(formControl: AbstractControl): { [key: string]: boolean } {
    let pattern: RegExp = /^[0-9a-zA-Z.-_]+$/;
    let userNme: string = formControl.value;
    let result: boolean = pattern.test(userNme);
    return result ? null : { 'userNameFormat': true };
  }
}
